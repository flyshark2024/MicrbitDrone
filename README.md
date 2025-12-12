# MicrobitDrone Package
![](https://raw.githubusercontent.com/flyshark2024/MicrbitDrone/master/image.jpg)

DIY Drone Bit is a DIY STEAM drone that uses the micro:bit for programming and flight control.

The micro:bit can be used to implement basic flight control functions for drones, including altitude hold, waypoint navigation, speed control, turning, and rotation.

## Basic usage
* To initialize the UAV
```JavaScript
Drones.initModule()
```
* Basic command of UAV, take off and landing
```JavaScript
Drones.Basic_action(Drones.Basicoptions.Takeoff)
```
* Move command, up and down, left and right, front and back
```JavaScript
Drones.Move_action(Drones.Directionoptions.Forward, 100)
```
* Rotation command, left to right
```JavaScript
Drones.Rotation_action(Drones.Angleoptions.Left, 0)
```
* Roll command, roll 360 degrees, forward, backward, left and right
```JavaScript
Drones.Roll_action(Drones.Rolloptions.Roll_forward)
```
* UAV hover, do not use pause, or UAV will land
```JavaScript
Drones.Hovering(0)
```
* Get the height or voltage of the UAV
```JavaScript
Drones.Get_Sensor(Drones.Sensoroptions.Voltage)
```
* Emergency command, highest priority. The rotor braked and the drone fell. Caution!
```JavaScript
Drones.Urgent_action(Drones.Urgentoptions.Emergency_stop)
```

## Code Example
```JavaScript
Drones.initModule()
Drones.Basic_action(Drones.Basicoptions.Takeoff)
Drones.Move_action(Drones.Directionoptions.Forward, 100)
basic.forever(function () {
    if (Drones.Get_Sensor(Drones.Sensoroptions.Voltage) > 3.5) {
        Drones.Hovering(10)
    } else {
        Drones.Basic_action(Drones.Basicoptions.Takeoff)
    }
})

```
## Supported targets
for microbit drone

## License
MIT

