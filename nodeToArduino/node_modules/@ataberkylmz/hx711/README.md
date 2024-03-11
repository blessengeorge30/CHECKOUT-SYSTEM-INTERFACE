# @ataberkylmz/hx711

This is a fork of [**@shroudedcode**'s `hx711` package](https://github.com/shroudedcode/hx711) which is also forked from [**@dangrie**'s `hx711` package](https://github.com/dangrie158/opencushion).

I've modified the library in such a way that it does not use 100% of the CPU all the time. Currently the usage is about 15-20% on Raspberry Pi 3 B+. This CPU usage is also reducible if we can figure out the sensor's response time and sleep till we possibly have a valid response. Currently the default sleep time is set to 100 nanoseconds.

This version also uses **Broadcom GPIO pin numbering**  instead of physical/board numbering.

## API

This library exposes a class with Name ```HX711``` that gives you access to all functions you need to interface.

### Constructor(Number clockPin, Number dataPin)
	const sensor = new HX711(clockPin, dataPin);

 create a new Sensor instance. The pin Numbers should represent the [WiringPi Pins](http://wiringpi.com/wp-content/uploads/2013/03/gpio1.png) the Sensor is connected to. You can have as many HX711 Chips connected as long as they all are connected to a different set of pins.

### getUnits([Number times = 10])
	let units = sensor.getUnits();

Read the sensor ```times``` times and calculate the average. This returns a scaled value with the offset removed.

### tare([Number times = 10])
	sensor.tare();

Read the sensor ```times``` times and save the average Offset via ```setOffset()```.

### setOffset([Number offset = 0])
	sensor.setOffset(-1000);

set or reset the offset for the sensor

### getOffset()
	let offset = sensor.getOffset();

get the current offset of the sensor

### setScale([Number scale = 1.0])
	sensor.setScale(3543.26);

set or reset the scale for the sensor

### getScale()
	let scale = sensor.getScale();

get the current scale of the sensor

### powerDown()
	sensor.powerDown();
	
Powers down the sensor. Sets the clock to low, then high and waits 60 microseconds
Note:  After a reset or power-down event, input selection is default to Channel A with a gain of 128.

### powerUp()
	sensor.powerUp();
	
Powers up the sensor. Sets the clock to low.
Note:  After a reset or power-down event, input selection is default to Channel A with a gain of 128.

## Troubleshooting

It sometimes can happen that the HX711 chip gets in a state where it does not recover itself. 
This can result in an endless loop while the library waits for the chip to notify a new data set.

If you ever run in a problem where the library does not give you new values, just power cycle the sensor.

Also if you use other GPIO pins of the Raspberry Pi with relay boards, the sensor might give inaccurate values when a relay is actuated then it goes back to giving normal values.