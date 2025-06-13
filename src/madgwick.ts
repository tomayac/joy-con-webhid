//= ====================================================================================================
// Based on MadgwickAHRS.c
//= ====================================================================================================
//
// Implementation of Madgwick's IMU and AHRS algorithms.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//= ====================================================================================================
import type { EulerAngles, MadgwickOptions, Quaternion } from "./types.ts";

export function Madgwick(sampleInterval: number, options?: MadgwickOptions) {
	//---------------------------------------------------------------------------------------------------
	// Definitions

	const opts = options || {};
	const sampleFreq = 1000 / sampleInterval; // sample frequency in Hz
	const beta = opts.beta ?? 0.4; // 2 * proportional gain
	let initalised = !(opts.doInitialisation === true);

	//---------------------------------------------------------------------------------------------------
	// Variable definitions
	let q0 = 1.0; // quaternion of sensor frame relative to auxiliary frame
	let q1 = 0.0;
	let q2 = 0.0;
	let q3 = 0.0;
	let recipSampleFreq = 1.0 / sampleFreq;

	//= ===================================================================================================
	// Functions

	//---------------------------------------------------------------------------------------------------
	// IMU algorithm update
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

		initalised = true;
	}

	//---------------------------------------------------------------------------------------------------
	// AHRS algorithm update
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

		if (!initalised) {
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
				v2bz * q2 * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
				(-v2bx * q3 + v2bz * q1) *
					(v2bx * (q1q2 - q0q3) + v2bz * (q0q1 + q2q3) - normMy) +
				v2bx * q2 * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
			s1 =
				v2q3 * (2.0 * q1q3 - v2q0q2 - normAx) +
				v2q0 * (2.0 * q0q1 + v2q2q3 - normAy) -
				4.0 * q1 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - normAz) +
				v2bz * q3 * (v2bx * (0.5 - q2q2 - q3q3) + v2bz * (q1q3 - q0q2) - normMx) +
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
				v2bx * q1 * (v2bx * (q0q2 + q1q3) + v2bz * (0.5 - q1q1 - q2q2) - normMz);
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
