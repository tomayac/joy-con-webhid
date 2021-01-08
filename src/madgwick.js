//= ====================================================================================================
// MadgwickAHRS.c
//= ====================================================================================================
//
// Implementation of Madgwick's IMU and AHRS algorithms.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//
// Date         Author          Notes
// 29/09/2011   SOH Madgwick    Initial release
// 02/10/2011   SOH Madgwick    Optimised for reduced CPU load
// 19/02/2012   SOH Madgwick    Magnetometer measurement is normalised
//
//= ====================================================================================================

/* eslint-disable one-var-declaration-per-line */

'use strict';

/**
 * The Madgwick algorithm.  See: http://www.x-io.co.uk/open-source-imu-and-ahrs-algorithms/.
 *
 * @param {number} sampleInterval - The sample interval in milliseconds.
 * @param {Object} options - The options.
 */
export function Madgwick(sampleInterval, options) {
  //---------------------------------------------------------------------------------------------------
  // Definitions

  options = options || {};
  const sampleFreq = 1000 / sampleInterval; // sample frequency in Hz
  let beta = options.beta || 1.0; // 2 * proportional gain - lower numbers are smoother, but take longer to get to correct attitude.
  let initalised = options.doInitialisation === true ? false : true;

  //---------------------------------------------------------------------------------------------------
  // Variable definitions
  let q0 = 1.0,
    q1 = 0.0,
    q2 = 0.0,
    q3 = 0.0; // quaternion of sensor frame relative to auxiliary frame
  let recipSampleFreq = 1.0 / sampleFreq;

  //= ===================================================================================================
  // Functions

  //---------------------------------------------------------------------------------------------------
  // IMU algorithm update
  function madgwickAHRSUpdateIMU(gx, gy, gz, ax, ay, az) {
    let recipNorm;
    let s0, s1, s2, s3;
    let qDot1, qDot2, qDot3, qDot4;
    let v2q0, v2q1, v2q2, v2q3, v4q0, v4q1, v4q2, v8q1, v8q2, q0q0, q1q1, q2q2, q3q3;

    // Rate of change of quaternion from gyroscope
    qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
    qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
    qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
    qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

    // Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
    if (!(ax === 0.0 && ay === 0.0 && az === 0.0)) {
      // Normalise accelerometer measurement
      recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Auxiliary variables to avoid repeated arithmetic
      v2q0 = 2.0 * q0;
      v2q1 = 2.0 * q1;
      v2q2 = 2.0 * q2;
      v2q3 = 2.0 * q3;
      v4q0 = 4.0 * q0;
      v4q1 = 4.0 * q1;
      v4q2 = 4.0 * q2;
      v8q1 = 8.0 * q1;
      v8q2 = 8.0 * q2;
      q0q0 = q0 * q0;
      q1q1 = q1 * q1;
      q2q2 = q2 * q2;
      q3q3 = q3 * q3;

      // Gradient decent algorithm corrective step
      s0 = v4q0 * q2q2 + v2q2 * ax + v4q0 * q1q1 - v2q1 * ay;
      s1 = v4q1 * q3q3 - v2q3 * ax + 4.0 * q0q0 * q1 - v2q0 * ay - v4q1 + v8q1 * q1q1 + v8q1 * q2q2 + v4q1 * az;
      s2 = 4.0 * q0q0 * q2 + v2q0 * ax + v4q2 * q3q3 - v2q3 * ay - v4q2 + v8q2 * q1q1 + v8q2 * q2q2 + v4q2 * az;
      s3 = 4.0 * q1q1 * q3 - v2q1 * ax + 4.0 * q2q2 * q3 - v2q2 * ay;
      recipNorm = (s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3) ** -0.5; // normalise step magnitude
      s0 *= recipNorm;
      s1 *= recipNorm;
      s2 *= recipNorm;
      s3 *= recipNorm;

      // Apply feedback step
      qDot1 -= beta * s0;
      qDot2 -= beta * s1;
      qDot3 -= beta * s2;
      qDot4 -= beta * s3;
    }

    // Integrate rate of change of quaternion to yield quaternion
    q0 += qDot1 * recipSampleFreq;
    q1 += qDot2 * recipSampleFreq;
    q2 += qDot3 * recipSampleFreq;
    q3 += qDot4 * recipSampleFreq;

    // Normalise quaternion
    recipNorm = (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) ** -0.5;
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  //---------------------------------------------------------------------------------------------------
  // Brute force the initialisation of the q values
  function doBruteForceInitialisation(ax, ay, az, mx, my, mz) {
    initalised = true;
    const betaOrig = beta;
    beta = 0.4;
    for (let i = 0; i <= 9; i += 1) {
      madgwickAHRSUpdate(0.0, 0.0, 0.0, ax, ay, az, mx, my, mz, 1.0);
    }
    beta = betaOrig;
  }

  //---------------------------------------------------------------------------------------------------
  // AHRS algorithm update

  function madgwickAHRSUpdate(gx, gy, gz, ax, ay, az, mx, my, mz, deltaTimeSec) {
    recipSampleFreq = deltaTimeSec || recipSampleFreq;

    if (!initalised) {
      doBruteForceInitialisation(ax, ay, az, mx, my, mz);
    }

    let recipNorm;
    let s0, s1, s2, s3;
    let qDot1, qDot2, qDot3, qDot4;
    let hx, hy;
    let v2q0mx, v2q0my, v2q0mz, v2q1mx, v2bx, v2bz, v4bx, v4bz, v2q0, v2q1, v2q2, v2q3, v2q0q2, v2q2q3;
    let q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;

    // Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
    if (mx === undefined || my === undefined || mz === undefined || (mx === 0 && my === 0 && mz === 0)) {
      madgwickAHRSUpdateIMU(gx, gy, gz, ax, ay, az);
      return;
    }

    // Rate of change of quaternion from gyroscope
    qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
    qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
    qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
    qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

    // Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
    if (!(ax === 0.0 && ay === 0.0 && az === 0.0)) {
      // Normalise accelerometer measurement
      recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Normalise magnetometer measurement
      recipNorm = (mx * mx + my * my + mz * mz) ** -0.5;
      mx *= recipNorm;
      my *= recipNorm;
      mz *= recipNorm;

      // Auxiliary variables to avoid repeated arithmetic
      v2q0mx = 2.0 * q0 * mx;
      v2q0my = 2.0 * q0 * my;
      v2q0mz = 2.0 * q0 * mz;
      v2q1mx = 2.0 * q1 * mx;
      v2q0 = 2.0 * q0;
      v2q1 = 2.0 * q1;
      v2q2 = 2.0 * q2;
      v2q3 = 2.0 * q3;
      v2q0q2 = 2.0 * q0 * q2;
      v2q2q3 = 2.0 * q2 * q3;
      q0q0 = q0 * q0;
      q0q1 = q0 * q1;
      q0q2 = q0 * q2;
      q0q3 = q0 * q3;
      q1q1 = q1 * q1;
      q1q2 = q1 * q2;
      q1q3 = q1 * q3;
      q2q2 = q2 * q2;
      q2q3 = q2 * q3;
      q3q3 = q3 * q3;

      // Reference direction of Earth's magnetic field
      hx = mx * q0q0 - v2q0my * q3 + v2q0mz * q2 + mx * q1q1 + v2q1 * my * q2 + v2q1 * mz * q3 - mx * q2q2 - mx * q3q3;
      hy = v2q0mx * q3 + my * q0q0 - v2q0mz * q1 + v2q1mx * q2 - my * q1q1 + my * q2q2 + v2q2 * mz * q3 - my * q3q3;
      v2bx = Math.sqrt(hx * hx + hy * hy);
      v2bz = -v2q0mx * q2 + v2q0my * q1 + mz * q0q0 + v2q1mx * q3 - mz * q1q1 + v2q2 * my * q3 - mz * q2q2 + mz * q3q3;
      v4bx = 2.0 * v2bx;
      v4bz = 2.0 * v2bz;

      // Gradient decent algorithm corrective step
      s0 =
        -v2q2 * (2.0 * q1q3 - v2q0q2 - ax) +
        v2q1 * (2.0 * q0q1 + v2q2q3 - ay) -
        v2bz * q2 * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - mx) +
        (-v2bx * q3 + v2bz * q1) * (v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - my) +
        v2bx * q2 * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - mz);
      s1 =
        v2q3 * (2.0 * q1q3 - v2q0q2 - ax) +
        v2q0 * (2.0 * q0q1 + v2q2q3 - ay) -
        4.0 * q1 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) +
        v2bz * q3 * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - mx) +
        (v2bx * q2 + v2bz * q0) * (v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - my) +
        (v2bx * q3 - v4bz * q1) * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - mz);
      s2 =
        -v2q0 * (2.0 * q1q3 - v2q0q2 - ax) +
        v2q3 * (2.0 * q0q1 + v2q2q3 - ay) -
        4.0 * q2 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) +
        (-v4bx * q2 - v2bz * q0) * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - mx) +
        (v2bx * q1 + v2bz * q3) * (v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - my) +
        (v2bx * q0 - v4bz * q2) * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - mz);
      s3 =
        v2q1 * (2.0 * q1q3 - v2q0q2 - ax) +
        v2q2 * (2.0 * q0q1 + v2q2q3 - ay) +
        (-v4bx * q3 + v2bz * q1) * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - mx) +
        (-v2bx * q0 + v2bz * q2) * (v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - my) +
        v2bx * q1 * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - mz);
      recipNorm = (s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3) ** -0.5; // normalise step magnitude
      s0 *= recipNorm;
      s1 *= recipNorm;
      s2 *= recipNorm;
      s3 *= recipNorm;

      // Apply feedback step
      qDot1 -= beta * s0;
      qDot2 -= beta * s1;
      qDot3 -= beta * s2;
      qDot4 -= beta * s3;
    }

    // Integrate rate of change of quaternion to yield quaternion
    q0 += qDot1 * recipSampleFreq;
    q1 += qDot2 * recipSampleFreq;
    q2 += qDot3 * recipSampleFreq;
    q3 += qDot4 * recipSampleFreq;

    // Normalise quaternion
    recipNorm = (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) ** -0.5;
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  return {
    update: madgwickAHRSUpdate,
    getQuaternion() {
      return {
        w: q0,
        x: q1,
        y: q2,
        z: q3,
      };
    },
  };

  //= ===================================================================================================
  // END OF CODE
  //= ===================================================================================================
};
