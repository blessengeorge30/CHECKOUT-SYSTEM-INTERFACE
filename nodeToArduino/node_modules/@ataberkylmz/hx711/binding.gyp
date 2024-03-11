{
  "targets": [
    {
      "target_name": "hx711",
      "sources": [
        "source/binding.cpp",
        "source/hx711.cpp"
      ],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "conditions":[
        ["target_arch=='arm'", {
          "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
          "libraries": ["-lwiringPi"],
        }],
      ],
    },
  ],
}
