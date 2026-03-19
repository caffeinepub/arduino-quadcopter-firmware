import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type QuadcopterSettings = {
    pidRoll : PIDSettings;
    pidPitch : PIDSettings;
    pidYaw : PIDSettings;
    maxThrottle : Nat;
    cameraEnabled : Bool;
    thermalCameraEnabled : Bool;
    failsafeEnabled : Bool;
  };

  module QuadcopterSettings {
    public func compare(settings1 : QuadcopterSettings, settings2 : QuadcopterSettings) : Order.Order {
      compareByMaxThrottle(settings1, settings2);
    };

    public func compareByMaxThrottle(settings1 : QuadcopterSettings, settings2 : QuadcopterSettings) : Order.Order {
      Nat.compare(settings1.maxThrottle, settings2.maxThrottle);
    };
  };

  type PIDSettings = {
    kp : Float;
    ki : Float;
    kd : Float;
  };

  module PIDSettings {
    public func compare(settings1 : PIDSettings, settings2 : PIDSettings) : Order.Order {
      compareByKI(settings1, settings2);
    };

    public func compareByKP(settings1 : PIDSettings, settings2 : PIDSettings) : Order.Order {
      Float.compare(settings1.kp, settings2.kp);
    };

    public func compareByKI(settings1 : PIDSettings, settings2 : PIDSettings) : Order.Order {
      Float.compare(settings1.ki, settings2.ki);
    };

    public func compareByKD(settings1 : PIDSettings, settings2 : PIDSettings) : Order.Order {
      Float.compare(settings1.kd, settings2.kd);
    };
  };

  let settings = Map.empty<Principal, QuadcopterSettings>();

  public shared ({ caller }) func setSettings(
    pidRoll : PIDSettings,
    pidPitch : PIDSettings,
    pidYaw : PIDSettings,
    maxThrottle : Nat,
    cameraEnabled : Bool,
    thermalCameraEnabled : Bool,
    failsafeEnabled : Bool,
  ) : async () {
    let newSettings : QuadcopterSettings = {
      pidRoll;
      pidPitch;
      pidYaw;
      maxThrottle;
      cameraEnabled;
      thermalCameraEnabled;
      failsafeEnabled;
    };
    settings.add(caller, newSettings);
  };

  public query ({ caller }) func getSettings() : async QuadcopterSettings {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) { s };
    };
  };

  public query ({ caller }) func getPIDSettings() : async ?{ roll : PIDSettings; pitch : PIDSettings; yaw : PIDSettings } {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) {
        ?{
          roll = s.pidRoll;
          pitch = s.pidPitch;
          yaw = s.pidYaw;
        };
      };
    };
  };

  public query ({ caller }) func isCameraEnabled() : async Bool {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) { s.cameraEnabled };
    };
  };

  public query ({ caller }) func isThermalCameraEnabled() : async Bool {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) { s.thermalCameraEnabled };
    };
  };

  public query ({ caller }) func isFailsafeEnabled() : async Bool {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) { s.failsafeEnabled };
    };
  };

  public query ({ caller }) func getMaxThrottle() : async Nat {
    switch (settings.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?s) { s.maxThrottle };
    };
  };
};
