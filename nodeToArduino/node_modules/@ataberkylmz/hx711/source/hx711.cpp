#include <stdio.h>
#include <inttypes.h>
#ifdef __arm__
#include <wiringPi.h>
#include <unistd.h>
#endif
#include "hx711.h"

#ifdef __arm__
HX711* hxp = NULL;

void readInstance() {
  hxp->mDataReady = true;
  hxp->read();
}
#endif

HX711::HX711(uint8_t clockPin, uint8_t dataPin) :
  mGainBits(1),
  mScale(1.0f),
  mOffset(0),
  mClockPin(clockPin),
  mDataPin(dataPin)
{
#ifdef __arm__
  wiringPiSetupGpio();

  pinMode(mClockPin, OUTPUT);
  pinMode(mDataPin, INPUT);

  hxp = this;
  // Setup interrupt on falling edge of data pin.
  wiringPiISR(mDataPin, INT_EDGE_FALLING, readInstance);
  this->mReading = false;
  this->mDataReady = false;
#endif
}

void HX711::setGain(uint8_t gain)
{
  switch (gain)
  {
  // channel A, gain 128
  case 128:
    this->mGainBits = 1;
    break;
  // channel A, gain 64
  case 64:
    this->mGainBits = 3;
    break;
  // channel B, gain 32
  case 32:
    this->mGainBits = 2;
    break;
  }

#ifdef __arm__
  digitalWrite(mClockPin, LOW);
  read();
#endif
}

void HX711::read() {
#ifdef __arm__
  if (!this->mReading && this->mDataReady) {
    this->mReading = true;

    int32_t data = 0;
    // pulse the clock pin 24 times to read the data
    for (uint8_t i = 24; i--;)
    {
      digitalWrite(mClockPin, HIGH);
      delayMicroseconds(1);
      digitalWrite(mClockPin, LOW);

      data |= (digitalRead(mDataPin) << i);
    }

    // set the channel and the gain factor for the next reading
    for (int i = 0; i < mGainBits; i++)
    {
      digitalWrite(mClockPin, HIGH);
      delayMicroseconds(1);
      digitalWrite(mClockPin, LOW);
    }

    if (data & 0x800000)
    {
      data |= 0xff000000UL;
    }

    if(this->mTimes != 0 && data != -1) {
      this->mLatestData = data;
      this->mSum += this->mLatestData;
      this->mTimes--;
    }
    
    this->mDataReady = false;
    this->mReading = false;
  }

#else
  this->mLatestData = 0;
#endif
}

int32_t HX711::readAverage()
{
#ifdef __arm__
  this->mSum = 0;
  int8_t times = this->mTimes;

  // TODO: find the sweetspot for best CPU usage and sensor resonse time.
  // Increasing the sleep time reduces CPU usage yet it might reduce the read speed too.
  // Fİgure out the sensor response time and set it accordingly.
  while(this->mTimes >= 1) usleep(100);

  return this->mSum / times;
#else
  return 0;
#endif
}

int32_t HX711::getRawValue()
{
  return readAverage() - mOffset;
}

float HX711::getUnits(uint8_t times)
{
  this->mTimes = times;
  return getRawValue() / mScale;
}

void HX711::tare(uint8_t times)
{
  this->mTimes = times;
  uint64_t sum = readAverage();
  setOffset(sum);
}

void HX711::setScale(float scale)
{
  this->mScale = scale;
}

void HX711::setOffset(int32_t offset)
{
  this->mOffset = offset;
}

void HX711::powerDown()
{
#ifdef __arm__
  digitalWrite(mClockPin, LOW);
  digitalWrite(mClockPin, HIGH);
  // The sensor powers down after 60 useconds
  usleep(60);
#endif
}

void HX711::powerUp()
{
#ifdef __arm__
  digitalWrite(mClockPin, LOW);
#endif
}

int32_t HX711::getOffset()
{
  return this->mOffset;
}

float HX711::getScale()
{
  return this->mScale;
}

int32_t HX711::getLatestData() {
  return this->mLatestData;
}