import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuadcopterSettings {
    maxThrottle: bigint;
    failsafeEnabled: boolean;
    thermalCameraEnabled: boolean;
    pidPitch: PIDSettings;
    pidYaw: PIDSettings;
    cameraEnabled: boolean;
    pidRoll: PIDSettings;
}
export interface PIDSettings {
    kd: number;
    ki: number;
    kp: number;
}
export interface backendInterface {
    getMaxThrottle(): Promise<bigint>;
    getPIDSettings(): Promise<{
        yaw: PIDSettings;
        roll: PIDSettings;
        pitch: PIDSettings;
    } | null>;
    getSettings(): Promise<QuadcopterSettings>;
    isCameraEnabled(): Promise<boolean>;
    isFailsafeEnabled(): Promise<boolean>;
    isThermalCameraEnabled(): Promise<boolean>;
    setSettings(pidRoll: PIDSettings, pidPitch: PIDSettings, pidYaw: PIDSettings, maxThrottle: bigint, cameraEnabled: boolean, thermalCameraEnabled: boolean, failsafeEnabled: boolean): Promise<void>;
}
