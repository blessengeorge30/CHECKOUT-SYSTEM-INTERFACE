#include <napi.h>
#include "hx711.h"

class HX711Wrapper : public Napi::ObjectWrap<HX711Wrapper>
{
public:
  static void Init(Napi::Env env, Napi::Object exports);
  HX711Wrapper(const Napi::CallbackInfo &info);
  ~HX711Wrapper();

private:
  static Napi::FunctionReference constructor;

  Napi::Value read(const Napi::CallbackInfo &info);
  void setScale(const Napi::CallbackInfo &info);
  void setOffset(const Napi::CallbackInfo &info);
  void tare(const Napi::CallbackInfo &info);
  Napi::Value getUnits(const Napi::CallbackInfo &info);
  Napi::Value getScale(const Napi::CallbackInfo &info);
  Napi::Value getOffset(const Napi::CallbackInfo &info);
  Napi::Value getLatestData(const Napi::CallbackInfo &info);
  void powerDown(const Napi::CallbackInfo &info);
  void powerUp(const Napi::CallbackInfo &info);

  HX711 *mSensor;
};
