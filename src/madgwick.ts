//= ====================================================================================================
// Based on MadgwickAHRS.c
//= ====================================================================================================
//
// Implementation of Madgwick's IMU and AHRS algorithms.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//= ====================================================================================================
import type { EulerAngles, MadgwickOptions, Quaternion } from "./types.ts";

/**
 * Implements the Madgwick sensor fusion algorithm for Attitude and Heading Reference Systems (AHRS).
 * This function returns an object that maintains the internal state of the filter and provides methods
 * to update the orientation estimate using gyroscope, accelerometer, and optionally magnetometer data.
 *
 * @param sampleInterval - The sample interval in milliseconds between sensor readings.
 * @param options - Optional configuration for the Madgwick filter.
 * @param options.beta - The algorithm gain (default is 0.4).
 * @param options.doInitialisation - If true, the filter will perform initialisation on the first update.
 *
 * @returns An object with the following methods:
 * - `update(gx, gy, gz, ax, ay, az, mx?, my?, mz?, deltaTimeSec?)`: Updates the filter state with new sensor data.
 *   - `gx`, `gy`, `gz`: Gyroscope readings in radians per second.
 *   - `ax`, `ay`, `az`: Accelerometer readings (normalized or in any consistent unit).
 *   - `mx`, `my`, `mz`: (Optional) Magnetometer readings (normalized or in any consistent unit).
 *   - `deltaTimeSec`: (Optional) Time step in seconds for this update; overrides the default sample interval.
 * - `init(ax, ay, az, mx, my, mz)`: Initializes the filter state using accelerometer and magnetometer data.
 * - `getQuaternion()`: Returns the current orientation as a quaternion `{ w, x, y, z }`.
 *
 * @example
 * ```typescript
 * const madgwick = Madgwick(10, { beta: 0.1 });
 * madgwick.update(gx, gy, gz, ax, ay, az, mx, my, mz);
 * const orientation = madgwick.getQuaternion();
 * ```
 *
 * @see https://x-io.co.uk/open-source-imu-and-ahrs-algorithms/
 */
export function Madgwick(sampleInterval: number, options?: MadgwickOptions) {
	const sampleFreq = 1000 / sampleInterval; // sample frequency in Hz
	const beta = options?.beta ?? 0.4; // 2 * proportional gain
	let initialised = !(options?.doInitialisation === true);

	let q0 = 1.0; // quaternion of sensor frame relative to auxiliary frame
	let q1 = 0.0;
	let q2 = 0.0;
	let q3 = 0.0;
	let recipSampleFreq = 1.0 / sampleFreq;

	/**
	 * Updates the orientation quaternion using the Madgwick AHRS (Attitude and Heading Reference System) algorithm,
	 * based on gyroscope and accelerometer measurements. This function implements the IMU (Inertial Measurement Unit)
	 * update step, which does not require magnetometer data.
	 *
	 * The algorithm fuses gyroscope and accelerometer data to estimate the orientation of the sensor in 3D space.
	 * It applies a gradient descent algorithm to minimize the error between measured and estimated direction of gravity.
	 *
	 * @param gx - Gyroscope X-axis angular velocity (in radians per second).
	 * @param gy - Gyroscope Y-axis angular velocity (in radians per second).
	 * @param gz - Gyroscope Z-axis angular velocity (in radians per second).
	 * @param ax - Accelerometer X-axis acceleration (in any consistent unit, typically m/s²).
	 * @param ay - Accelerometer Y-axis acceleration (in any consistent unit, typically m/s²).
	 * @param az - Accelerometer Z-axis acceleration (in any consistent unit, typically m/s²).
	 *
	 * @remarks
	 * - This function updates the global quaternion variables (`q0`, `q1`, `q2`, `q3`) representing orientation.
	 * - The `beta` and `recipSampleFreq` variables must be defined in the containing scope.
	 * - Accelerometer measurements must not all be zero for the feedback step to be applied.
	 * - The quaternion is normalized after each update to ensure valid rotation representation.
	 */
	function madgwickAHRSUpdateIMU(
		gx: number,
		gy: number,
		gz: number,
		ax: number,
		ay: number,
		az: number,
	): void {
		let recipNorm: number;
		let s0: number;
		let s1: number;
		let s2: number;
		let s3: number;
		let qDot1: number;
		let qDot2: number;
		let qDot3: number;
		let qDot4: number;
		let v2q0: number;
		let v2q1: number;
		let v2q2: number;
		let v2q3: number;
		let v4q0: number;
		let v4q1: number;
		let v4q2: number;
		let v8q1: number;
		let v8q2: number;
		let q0q0: number;
		let q1q1: number;
		let q2q2: number;
		let q3q3: number;

		// Rate of change of quaternion from gyroscope
		qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
		qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
		qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
		qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

		// Compute feedback only if accelerometer measurement valid
		if (!(ax === 0.0 && ay === 0.0 && az === 0.0)) {
			// Normalise accelerometer measurement
			recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
			const normAx = ax * recipNorm;
			const normAy = ay * recipNorm;
			const normAz = az * recipNorm;

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
			s0 = v4q0 * q2q2 + v2q2 * normAx + v4q0 * q1q1 - v2q1 * normAy;
			s1 =
				v4q1 * q3q3 -
				v2q3 * normAx +
				4.0 * q0q0 * q1 -
				v2q0 * normAy -
				v4q1 +
				v8q1 * q1q1 +
				v8q1 * q2q2 +
				v4q1 * normAz;
			s2 =
				4.0 * q0q0 * q2 +
				v2q0 * normAx +
				v4q2 * q3q3 -
				v2q3 * normAy -
				v4q2 +
				v8q2 * q1q1 +
				v8q2 * q2q2 +
				v4q2 * normAz;
			s3 = 4.0 * q1q1 * q3 - v2q1 * normAx + 4.0 * q2q2 * q3 - v2q2 * normAy;
			recipNorm = (s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3) ** -0.5;
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

	/**
	 * Computes the cross product of two 3D vectors (a × b).
	 *
	 * @param ax - The x component of the first vector.
	 * @param ay - The y component of the first vector.
	 * @param az - The z component of the first vector.
	 * @param bx - The x component of the second vector.
	 * @param by - The y component of the second vector.
	 * @param bz - The z component of the second vector.
	 * @returns An object representing the resulting vector with properties x, y, and z.
	 */
	function cross_product(
		ax: number,
		ay: number,
		az: number,
		bx: number,
		by: number,
		bz: number,
	) {
		return {
			x: ay * bz - az * by,
			y: az * bx - ax * bz,
			z: ax * by - ay * bx,
		};
	}

	/**
	 * Calculates Euler angles (heading, pitch, and roll) in radians from IMU sensor data.
	 *
	 * This function takes accelerometer and magnetometer readings and computes the
	 * corresponding Euler angles. The angles are calculated as follows:
	 * - `pitch`: Derived from the accelerometer's X, Y, and Z axes.
	 * - `roll`: Calculated using cross products of the accelerometer vector and a reference vector.
	 * - `heading`: Computed from the magnetometer readings, adjusted by the calculated pitch and roll.
	 *
	 * @param ax - Accelerometer X-axis reading.
	 * @param ay - Accelerometer Y-axis reading.
	 * @param az - Accelerometer Z-axis reading.
	 * @param mx - Magnetometer X-axis reading.
	 * @param my - Magnetometer Y-axis reading.
	 * @param mz - Magnetometer Z-axis reading.
	 * @returns An object containing the Euler angles: `heading`, `pitch`, and `roll` (all in radians).
	 */
	function eulerAnglesFromImuRad(
		ax: number,
		ay: number,
		az: number,
		mx: number,
		my: number,
		mz: number,
	): EulerAngles {
		const pitch = -Math.atan2(ax, Math.sqrt(ay * ay + az * az));

		const tmp1 = cross_product(ax, ay, az, 1.0, 0.0, 0.0);
		const tmp2 = cross_product(1.0, 0.0, 0.0, tmp1.x, tmp1.y, tmp1.z);
		const roll = Math.atan2(tmp2.y, tmp2.z);

		const cr = Math.cos(roll);
		const sp = Math.sin(pitch);
		const sr = Math.sin(roll);
		const yh = my * cr - mz * sr;
		const xh = mx * Math.cos(pitch) + my * sr * sp + mz * cr * sp;

		const heading = -Math.atan2(yh, xh);

		return {
			heading,
			pitch,
			roll,
		};
	}

	/**
	 * Converts Euler angles (heading, pitch, roll) to a quaternion representation.
	 *
	 * @param eulerAngles - The Euler angles to convert, containing heading, pitch, and roll in radians.
	 * @returns A quaternion representing the same orientation as the provided Euler angles.
	 */
	function toQuaternion(eulerAngles: EulerAngles): Quaternion {
		const cy = Math.cos(eulerAngles.heading * 0.5);
		const sy = Math.sin(eulerAngles.heading * 0.5);
		const cp = Math.cos(eulerAngles.pitch * 0.5);
		const sp = Math.sin(eulerAngles.pitch * 0.5);
		const cr = Math.cos(eulerAngles.roll * 0.5);
		const sr = Math.sin(eulerAngles.roll * 0.5);

		return {
			w: cr * cp * cy + sr * sp * sy,
			x: sr * cp * cy - cr * sp * sy,
			y: cr * sp * cy + sr * cp * sy,
			z: cr * cp * sy - sr * sp * cy,
		};
	}

	/**
	 * Initializes the orientation quaternion using accelerometer and magnetometer data.
	 *
	 * @param ax - Acceleration along the X-axis (in m/s² or g).
	 * @param ay - Acceleration along the Y-axis (in m/s² or g).
	 * @param az - Acceleration along the Z-axis (in m/s² or g).
	 * @param mx - Magnetic field along the X-axis.
	 * @param my - Magnetic field along the Y-axis.
	 * @param mz - Magnetic field along the Z-axis.
	 *
	 * This function computes the initial orientation quaternion from the provided
	 * accelerometer and magnetometer readings, normalizes it, and sets the internal
	 * state as initialized.
	 */
	function init(
		ax: number,
		ay: number,
		az: number,
		mx: number,
		my: number,
		mz: number,
	): void {
		const ea = eulerAnglesFromImuRad(ax, ay, az, mx, my, mz);
		const iq = toQuaternion(ea);

		// Normalise quaternion
		const recipNorm =
			(iq.w * iq.w + iq.x * iq.x + iq.y * iq.y + iq.z * iq.z) ** -0.5;
		q0 = iq.w * recipNorm;
		q1 = iq.x * recipNorm;
		q2 = iq.y * recipNorm;
		q3 = iq.z * recipNorm;

		initialised = true;
	}

	/**
	 * Updates the orientation quaternion using the Madgwick AHRS (Attitude and Heading Reference System) algorithm.
	 * This function fuses gyroscope, accelerometer, and (optionally) magnetometer data to estimate orientation.
	 *
	 * @param gx - Gyroscope X axis measurement in radians/sec.
	 * @param gy - Gyroscope Y axis measurement in radians/sec.
	 * @param gz - Gyroscope Z axis measurement in radians/sec.
	 * @param ax - Accelerometer X axis measurement in any calibrated units.
	 * @param ay - Accelerometer Y axis measurement in any calibrated units.
	 * @param az - Accelerometer Z axis measurement in any calibrated units.
	 * @param mx - (Optional) Magnetometer X axis measurement in any calibrated units. If omitted or zero, IMU-only update is used.
	 * @param my - (Optional) Magnetometer Y axis measurement in any calibrated units. If omitted or zero, IMU-only update is used.
	 * @param mz - (Optional) Magnetometer Z axis measurement in any calibrated units. If omitted or zero, IMU-only update is used.
	 * @param deltaTimeSec - (Optional) Time step in seconds since the last update. If omitted, the previous sample frequency is used.
	 *
	 * @remarks
	 * - The function maintains and updates the global orientation quaternion variables (`q0`, `q1`, `q2`, `q3`).
	 * - If magnetometer data is invalid or not provided, the algorithm falls back to IMU-only mode (gyroscope + accelerometer).
	 * - The function assumes that the sensor data is already calibrated.
	 * - Quaternion normalization is performed after each update to prevent error accumulation.
	 */
	function madgwickAHRSUpdate(
		gx: number,
		gy: number,
		gz: number,
		ax: number,
		ay: number,
		az: number,
		mx?: number,
		my?: number,
		mz?: number,
		deltaTimeSec?: number,
	): void {
		recipSampleFreq = deltaTimeSec ?? recipSampleFreq;

		if (!initialised) {
			init(ax, ay, az, mx ?? 0, my ?? 0, mz ?? 0);
		}

		let recipNorm: number;
		let s0: number;
		let s1: number;
		let s2: number;
		let s3: number;
		let qDot1: number;
		let qDot2: number;
		let qDot3: number;
		let qDot4: number;
		let hx: number;
		let hy: number;
		let v2q0mx: number;
		let v2q0my: number;
		let v2q0mz: number;
		let v2q1mx: number;
		let v2bx: number;
		let v2bz: number;
		let v4bx: number;
		let v4bz: number;
		let v2q0: number;
		let v2q1: number;
		let v2q2: number;
		let v2q3: number;
		let v2q0q2: number;
		let v2q2q3: number;
		let q0q0: number;
		let q0q1: number;
		let q0q2: number;
		let q0q3: number;
		let q1q1: number;
		let q1q2: number;
		let q1q3: number;
		let q2q2: number;
		let q2q3: number;
		let q3q3: number;

		// Use IMU algorithm if magnetometer measurement invalid
		if (
			mx === undefined ||
			my === undefined ||
			mz === undefined ||
			(mx === 0 && my === 0 && mz === 0)
		) {
			madgwickAHRSUpdateIMU(gx, gy, gz, ax, ay, az);
			return;
		}

		// Rate of change of quaternion from gyroscope
		qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
		qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
		qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
		qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

		// Compute feedback only if accelerometer measurement valid
		if (!(ax === 0.0 && ay === 0.0 && az === 0.0)) {
			// Normalise accelerometer measurement
			recipNorm = (ax * ax + ay * ay + az * az) ** -0.5;
			const normAx = ax * recipNorm;
			const normAy = ay * recipNorm;
			const normAz = az * recipNorm;

			// Normalise magnetometer measurement
			recipNorm = (mx * mx + my * my + mz * mz) ** -0.5;
			const normMx = mx * recipNorm;
			const normMy = my * recipNorm;
			const normMz = mz * recipNorm;

			// Auxiliary variables to avoid repeated arithmetic
			v2q0mx = 2.0 * q0 * normMx;
			v2q0my = 2.0 * q0 * normMy;
			v2q0mz = 2.0 * q0 * normMz;
			v2q1mx = 2.0 * q1 * normMx;
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
			hx =
				mx * q0q0 -
				v2q0my * q3 +
				v2q0mz * q2 +
				mx * q1q1 +
				v2q1 * my * q2 +
				v2q1 * mz * q3 -
				mx * q2q2 -
				mx * q3q3;
			hy =
				v2q0mx * q3 +
				my * q0q0 -
				v2q0mz * q1 +
				v2q1mx * q2 -
				my * q1q1 +
				my * q2q2 +
				v2q2 * mz * q3 -
				my * q3q3;
			v2bx = Math.sqrt(hx * hx + hy * hy);
			v2bz =
				-v2q0mx * q2 +
				v2q0my * q1 +
				mz * q0q0 +
				v2q1mx * q3 -
				mz * q1q1 +
				v2q2 * my * q3 -
				mz * q2q2 +
				mz * q3q3;
			v4bx = 2.0 * v2bx;
			v4bz = 2.0 * v2bz;

			// Gradient decent algorithm corrective step
			s0 =
				-v2q2 * (2.0 * q1q3 - v2q0q2 - normAx) +
				v2q1 * (2.0 * q0q1 + v2q2q3 - normAy) -
				v2bz *
					q2 *
					(v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
				(-v2bx * q3 + v2bz * q1) *
					(v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - normMy) +
				v2bx *
					q2 *
					(v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
			s1 =
				v2q3 * (2.0 * q1q3 - v2q0q2 - normAx) +
				v2q0 * (2.0 * q0q1 + v2q2q3 - normAy) -
				4.0 * q1 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - normAz) +
				v2bz *
					q3 *
					(v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
				(v2bx * q2 + v2bz * q0) *
					(v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - normMy) +
				(v2bx * q3 - v4bz * q1) *
					(v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
			s2 =
				-v2q0 * (2.0 * q1q3 - v2q0q2 - normAx) +
				v2q3 * (2.0 * q0q1 + v2q2q3 - normAy) -
				4.0 * q2 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - normAz) +
				(-v4bx * q2 - v2bz * q0) *
					(v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
				(v2bx * q1 + v2bz * q3) *
					(v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - normMy) +
				(v2bx * q0 - v4bz * q2) *
					(v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
			s3 =
				v2q1 * (2.0 * q1q3 - v2q0q2 - normAx) +
				v2q2 * (2.0 * q0q1 + v2q2q3 - normAy) +
				(-v4bx * q3 + v2bz * q1) *
					(v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
				(-v2bx * q0 + v2bz * q2) *
					(v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - normMy) +
				v2bx *
					q1 *
					(v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
			recipNorm = (s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3) ** -0.5;
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
		init,
		getQuaternion(): Quaternion {
			return {
				w: q0,
				x: q1,
				y: q2,
				z: q3,
			};
		},
	};
}
