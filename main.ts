/**
* Functions to UVA by FLY-SHARK
*/
//% color=#FF0000  icon="\uf072" block="Drones" blockId="Drones"
//% groups='["Basic", "Caution!"]'
namespace Drones {
    let isInit = 0
    export enum Runmodes {
        //% block="Master"
        Master = 0x01,
        //% block="Remote"
        Remote = 0x02
    }
    export enum Basicoptions {
        //% block="Take off" 
        Takeoff = 0x01,
        //% block="Landing"
        Landing = 0x02
    }
    export enum Urgentoptions {
        //% block="Emergency stop"
        Emergency_stop = 0x05
    }
    export enum Directionoptions {
        //% block="Forward" 
        Forward = 0x12,
        //% block="Backward"
        Backward = 0x13,
        //% block="Left" 
        Left = 0x14,
        //% block="Right"
        Right = 0x15
    }
    export enum Angleoptions {
        //% block="Left" 
        Left = 0x16,
        //% block="Right"
        Right = 0x17
    }
    export enum Rolloptions {
        //% block="Roll forward" 
        Roll_forward = 0x20,
        //% block="Roll back"
        Roll_back = 0x21,
        //% block="Roll left" 
        Roll_left = 0x22,
        //% block="Roll right"
        Roll_right = 0x23
    }
    export enum Sensoroptions {
        //% block="Voltage" 
        Voltage = 0x01,
        //% block="Height"
        Height = 0x02
    }
    function WaitCellback(): boolean {
        while(true){
            let txBuff = pins.createBuffer(8)
            txBuff[0] = 0xa5
            txBuff[1] = 0x5a
            serial.writeBuffer(txBuff)
            serial.setRxBufferSize(8)
            basic.pause(500)
            let rowData = serial.readBuffer(0)
            if(rowData.length < 8){
                basic.showIcon(IconNames.No)
                return false
            }else{
                if (rowData[0] == 0x5a && rowData[1] == 0xff){
                    //basic.showIcon(IconNames.Yes)
                    //music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
                    return true
                }
            }
        }
        return false
    }

    //% block="Initialize UAV"
    //% weight=100 group="Basic"
    export function initModule(): void {
        if (isInit == 0){
            isInit = 1
            //basic.showIcon(IconNames.Target)
            serial.redirect(
                SerialPin.P14,
                SerialPin.P13,
                BaudRate.BaudRate115200
            )
            music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        }
    }
    //% block="Setting UAV altitude $alt cm"
    //% alt.min=0 alt.max=100
    //% weight=90 group="Basic"
    export function UAV_altitude(alt: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x01
        if (alt > 255) {
            txBuff[2] = 255
            txBuff[3] = alt - 255
        }
        else {
            txBuff[2] = alt
            txBuff[3] = 0
        }
        serial.writeBuffer(txBuff)
        WaitCellback()
    }
    //% block="Basic action %basicstate"
    //% weight=89 group="Basic"
    export function Basic_action(basicstate: Basicoptions): void {
        initModule()
        if (basicstate == 1) {
            for (let index = 3; index >= 0; index--) {
                basic.showNumber(index)
                if (index == 0) {
                    music.playTone(523, music.beat(BeatFraction.Double))
                } else {
                    music.playTone(262, music.beat(BeatFraction.Whole))
                }
            }
        }
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x06
        txBuff[2] = basicstate
        serial.writeBuffer(txBuff)
        WaitCellback()
    }

    //% block="Move action %Directionstate by %distance cm"
    //% weight=70 group="Basic"
    export function Move_action(Directionstate: Directionoptions, distance: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x02
        txBuff[2] = Directionstate
        if (distance > 255) {
            txBuff[3] = 255
            txBuff[4] = distance - 255
        }
        else {
            txBuff[3] = distance
            txBuff[4] = 0
        }
        serial.writeBuffer(txBuff)
        WaitCellback()
    }
    //% block="Rotation action %rotationstate by %angle °"
    //% weight=65 group="Basic"
    export function Rotation_action(rotationstate: Angleoptions, angle: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x03
        txBuff[2] = rotationstate
        if (angle > 255) {
            txBuff[3] = 255
            txBuff[4] = angle - 255
        }
        else {
            txBuff[3] = angle
            txBuff[4] = 0
        }
        serial.writeBuffer(txBuff)
        WaitCellback()
    }
    //% block="Roll action %rotationstate "
    //% weight=64 group="Basic"
    //% deprecated=true
    export function Roll_action(rollstate: Rolloptions): void {
        initModule()
        serial.readString()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[2] = 0x07
        txBuff[3] = rollstate
        serial.writeBuffer(txBuff)
        WaitCellback()
    }

    //% block="Get %state Value"
    //% weight=50 group="Basic"
    export function Get_Sensor(state: Sensoroptions): number {
        initModule()
        while (true) {
            let txBuff = pins.createBuffer(8)
            txBuff[0] = 0xa5
            txBuff[1] = 0x81
            serial.writeBuffer(txBuff)
            serial.setRxBufferSize(8)
            basic.pause(500)
            let rowData = serial.readBuffer(0)
            if (rowData.length < 8) {
                basic.showIcon(IconNames.No)
                return 0
            } else {
                if (rowData[0] == 0x5a && rowData[1] == 0x81) {
                    //basic.showIcon(IconNames.Yes)
                    //music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
                    if (state == Sensoroptions.Voltage) {
                        return (rowData[2]) * 0.1
                    }

                    return 0
                }
            }
        }
        return 0;
    }
}