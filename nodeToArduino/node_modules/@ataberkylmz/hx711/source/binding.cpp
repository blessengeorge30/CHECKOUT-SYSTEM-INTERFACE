#include "binding.h"
#include <napi.h>

Napi::FunctionReference HX711Wrapper::constructor;

void HX711Wrapper::Init(Napi::Env env, Napi::Object exports)
{
  Napi::Function func = DefineClass(env, "HX711", {
    InstanceMethod("read", &HX711Wrapper::read),
    InstanceMethod("setScale", &HX711Wrapper::setScale),
    InstanceMethod("setOffset", &HX711Wrapper::setOffset),
    InstanceMethod("tare", &HX711Wrapper::tare),
    InstanceMethod("getUnits", &HX711Wrapper::getUnits),
    InstanceMethod("getScale", &HX711Wrapper::getScale),
    InstanceMethod("getOffset", &HX711Wrapper::getOffset),
    InstanceMethod("powerDown", &HX711Wrapper::powerDown),
    InstanceMethod("powerUp", &HX711Wrapper::powerUp)

  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("HX711", func);
}

HX711Wrapper::HX711Wrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<HX711Wrapper>(info)
{
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  if (info.Length() < 2)
  {
    Napi::TypeError::New(env, "You need to pass 2 arguments").ThrowAsJavaScriptException();
    return;
  }

  const uint8_t clockPin = (uint32_t)info[0].ToNumber();
  const uint8_t dataPin = (uint32_t)info[1].ToNumber();
  const uint8_t gain = info[2].IsUndefined() ? 128 : info[2].ToNumber();

  mSensor = new HX711(clockPin, dataPin);
  mSensor->setGain(gain);
}

HX711Wrapper::~HX711Wrapper()
{
  delete mSensor;
}

Napi::Value HX711Wrapper::read(const Napi::CallbackInfo &info)
{
  // Read should be called by interrupt provided from WiringPi.
  Napi::Env env = info.Env();

  int32_t value = mSensor->getLatestData();
  return Napi::Number::New(env, value);
}

void HX711Wrapper::setScale(const Napi::CallbackInfo &info)
{
  float scaleArg = info[0].IsUndefined() ? 1.0f : info[0].ToNumber();
  mSensor->setScale(scaleArg);
}

void HX711Wrapper::setOffset(const Napi::CallbackInfo &info)
{
  int32_t offsetArg = info[0].IsUndefined() ? 0 : info[0].ToNumber();
  mSensor->setOffset(offsetArg);
}

void HX711Wrapper::tare(const Napi::CallbackInfo &info)
{
  uint8_t timesArg = info[0].IsUndefined() ? 10 : info[0].ToNumber();
  mSensor->tare(timesArg);
}

Napi::Value HX711Wrapper::getUnits(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  uint8_t timesArg = info[0].IsUndefined() ? 10 : info[0].ToNumber();
  float value = mSensor->getUnits(timesArg);

  return Napi::Number::New(env, value);
}

Napi::Value HX711Wrapper::getOffset(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  int32_t value = mSensor->getOffset();
  return Napi::Number::New(env, value);
}

Napi::Value HX711Wrapper::getScale(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  float value = mSensor->getScale();
  return Napi::Number::New(env, value);
}

Napi::Value HX711Wrapper::getLatestData(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  int32_t value = mSensor->getLatestData();
  return Napi::Number::New(env, value);
}

void HX711Wrapper::powerDown(const Napi::CallbackInfo &info)
{
  mSensor->powerDown();
}

void HX711Wrapper::powerUp(const Napi::CallbackInfo &info)
{
  mSensor->powerUp();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  HX711Wrapper::Init(env, exports);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
