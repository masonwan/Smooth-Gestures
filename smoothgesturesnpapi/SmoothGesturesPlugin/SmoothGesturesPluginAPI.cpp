/**********************************************************\

  Auto-generated SmoothGesturesPluginAPI.cpp

\**********************************************************/


#ifdef __linux__
#include <X11/Xlib.h>
#include <X11/keysym.h>
#include <X11/extensions/XTest.h>
#endif

#ifdef _WIN32
#define _WIN32_WINNT 0x0500
#include <windows.h>
#endif

#ifdef __APPLE__
#include <ApplicationServices/ApplicationServices.h>
#include <CoreFoundation/CoreFoundation.h>
#include <Carbon/Carbon.h>
#endif

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"

#include "SmoothGesturesPluginAPI.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn SmoothGesturesPluginAPI::SmoothGesturesPluginAPI(SmoothGesturesPluginPtr plugin, FB::BrowserHostPtr host)
///
/// @brief  Constructor for your JSAPI object.  You should register your methods, properties, and events
///         that should be accessible to Javascript from here.
///
/// @see FB::JSAPIAuto::registerMethod
/// @see FB::JSAPIAuto::registerProperty
/// @see FB::JSAPIAuto::registerEvent
///////////////////////////////////////////////////////////////////////////////
SmoothGesturesPluginAPI::SmoothGesturesPluginAPI(SmoothGesturesPluginPtr plugin, FB::BrowserHostPtr host) : m_plugin(plugin), m_host(host)
{
    registerProperty("version",
                     make_property(this,
                        &SmoothGesturesPluginAPI::get_version));

    registerMethod("sendkeys",  make_method(this, &SmoothGesturesPluginAPI::sendkeys));
    registerMethod("sendkey",   make_method(this, &SmoothGesturesPluginAPI::sendkey));
    registerMethod("sendbutton",make_method(this, &SmoothGesturesPluginAPI::sendbutton));
}

///////////////////////////////////////////////////////////////////////////////
/// @fn SmoothGesturesPluginAPI::~SmoothGesturesPluginAPI()
///
/// @brief  Destructor.  Remember that this object will not be released until
///         the browser is done with it; this will almost definitely be after
///         the plugin is released.
///////////////////////////////////////////////////////////////////////////////
SmoothGesturesPluginAPI::~SmoothGesturesPluginAPI()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @fn SmoothGesturesPluginPtr SmoothGesturesPluginAPI::getPlugin()
///
/// @brief  Gets a reference to the plugin that was passed in when the object
///         was created.  If the plugin has already been released then this
///         will throw a FB::script_error that will be translated into a
///         javascript exception in the page.
///////////////////////////////////////////////////////////////////////////////
SmoothGesturesPluginPtr SmoothGesturesPluginAPI::getPlugin()
{
    SmoothGesturesPluginPtr plugin(m_plugin.lock());
    if (!plugin) {
        throw FB::script_error("The plugin is invalid");
    }
    return plugin;
}

std::string SmoothGesturesPluginAPI::get_version()
{
    return "0.3.2";
}








#ifdef _WIN32
INPUT SmoothGesturesPluginAPI::mouseinput(int b, bool down) {
  MOUSEINPUT mi;
  mi.dx = 0;
  mi.dy = 0;
  mi.mouseData = 0;
  mi.dwFlags = (b==0?(down?MOUSEEVENTF_LEFTDOWN:MOUSEEVENTF_LEFTUP):
               (b==1?(down?MOUSEEVENTF_MIDDLEDOWN:MOUSEEVENTF_MIDDLEUP):
                     (down?MOUSEEVENTF_RIGHTDOWN:MOUSEEVENTF_RIGHTUP)));
  mi.time = 0;
  mi.dwExtraInfo = (ULONG_PTR) GetMessageExtraInfo();
  INPUT input;
  input.type = INPUT_MOUSE;
  input.mi   = mi;
  return input;
}
INPUT SmoothGesturesPluginAPI::keyinput(int k, bool down) {
  KEYBDINPUT kbi;
  if(k == 0xffe1) kbi.wVk = VK_LSHIFT;
  else if(k == 0xffe2) kbi.wVk = VK_RSHIFT;
  else if(k == 0xffe3) kbi.wVk = VK_LCONTROL;
  else if(k == 0xffe4) kbi.wVk = VK_RCONTROL;
  else if(k == 0xffe5) kbi.wVk = VK_CAPITAL;
  else if(k == 0xffe7) kbi.wVk = VK_LWIN;
  else if(k == 0xffe8) kbi.wVk = VK_RWIN;
  else if(k == 0xffe9) kbi.wVk = VK_LMENU;
  else if(k == 0xffea) kbi.wVk = VK_RMENU;
  else if(k == 0xffeb) kbi.wVk = VK_LWIN;
  else if(k == 0xffec) kbi.wVk = VK_RWIN;
  else if(k == 0xffed) kbi.wVk = VK_LWIN;
  else if(k == 0xffee) kbi.wVk = VK_RWIN;
  else if(k > 0xffbd && k<= 0xffbd+24) kbi.wVk = k-0xffbd-1+VK_F1;
  else if(k == 0xff7f) kbi.wVk = VK_NUMLOCK;
  else if(k == 0xff1b) kbi.wVk = VK_ESCAPE;
  else if(k == 0xff0d) kbi.wVk = VK_RETURN;
  else if(k == 0xff09) kbi.wVk = VK_TAB;
  else if(k == 0xff08) kbi.wVk = VK_BACK;
  else if(k == 0xff57) kbi.wVk = VK_END;
  else if(k == 0xff50) kbi.wVk = VK_HOME;
  else if(k == 0xff51) kbi.wVk = VK_LEFT;
  else if(k == 0xff52) kbi.wVk = VK_UP;
  else if(k == 0xff53) kbi.wVk = VK_RIGHT;
  else if(k == 0xff54) kbi.wVk = VK_DOWN;
  else if(k == 0xfd1d) kbi.wVk = VK_SNAPSHOT;
  else if(k == 0xff63) kbi.wVk = VK_INSERT;
  else if(k == 0xffff) kbi.wVk = VK_DELETE;
  else if(k == 0xff67) kbi.wVk = VK_APPS;
  else kbi.wVk = VkKeyScan(k);
  kbi.wScan = 0;
  kbi.dwFlags = (down?0:KEYEVENTF_KEYUP);
  kbi.time = 0;
  kbi.dwExtraInfo = (ULONG_PTR) GetMessageExtraInfo();
  INPUT input;
  input.type = INPUT_KEYBOARD;
  input.ki   = kbi;
  return input;
}
#endif

#ifdef __APPLE__
CGKeyCode SmoothGesturesPluginAPI::getkeycode(int k) {
  if(k == 0xffe1) return (CGKeyCode)56; //VK_LSHIFT;
  else if(k == 0xffe2) return (CGKeyCode)56; //VK_RSHIFT;
  else if(k == 0xffe3) return (CGKeyCode)59; //VK_LCONTROL;
  else if(k == 0xffe4) return (CGKeyCode)59; //VK_RCONTROL;
  else if(k == 0xffe5) return (CGKeyCode)57; //VK_CAPITAL;
  else if(k == 0xffe7) return (CGKeyCode)58; //VK_LWIN;
  else if(k == 0xffe8) return (CGKeyCode)58; //VK_RWIN;
  else if(k == 0xffe9) return (CGKeyCode)55; //VK_LMENU;
  else if(k == 0xffea) return (CGKeyCode)55; //VK_RMENU;
  else if(k == 0xffeb) return (CGKeyCode)58; //VK_LWIN;
  else if(k == 0xffec) return (CGKeyCode)58; //VK_RWIN;
  else if(k == 0xffed) return (CGKeyCode)58; //VK_LWIN;
  else if(k == 0xffee) return (CGKeyCode)58; //VK_RWIN;
  else if(k == 0xffbe) return (CGKeyCode)122; //VK_F1;
  else if(k == 0xffbe) return (CGKeyCode)120; //VK_F2;
  else if(k == 0xffbe) return (CGKeyCode)99; //VK_F3;
  else if(k == 0xffbe) return (CGKeyCode)118; //VK_F4;
  else if(k == 0xffbe) return (CGKeyCode)96; //VK_F5;
  else if(k == 0xffbe) return (CGKeyCode)97; //VK_F6;
  else if(k == 0xffbe) return (CGKeyCode)98; //VK_F7;
  else if(k == 0xffbe) return (CGKeyCode)100; //VK_F8;
  else if(k == 0xffbe) return (CGKeyCode)101; //VK_F9;
  else if(k == 0xffbe) return (CGKeyCode)109; //VK_F10;
  else if(k == 0xffbe) return (CGKeyCode)103; //VK_F11;
  else if(k == 0xffbe) return (CGKeyCode)111; //VK_F12;
  else if(k == 0xff7f) return (CGKeyCode)71; //VK_NUMLOCK;
  else if(k == 0xff1b) return (CGKeyCode)53; //VK_ESCAPE;
  else if(k == 0xff0d) return (CGKeyCode)36; //VK_RETURN;
  else if(k == 0xff09) return (CGKeyCode)48; //VK_TAB;
  else if(k == 0xff08) return (CGKeyCode)51; //VK_BACK;
  else if(k == 0xff57) return (CGKeyCode)119; //VK_END;
  else if(k == 0xff50) return (CGKeyCode)115; //VK_HOME;
  else if(k == 0xff51) return (CGKeyCode)123; //VK_LEFT;
  else if(k == 0xff52) return (CGKeyCode)126; //VK_UP;
  else if(k == 0xff53) return (CGKeyCode)124; //VK_RIGHT;
  else if(k == 0xff54) return (CGKeyCode)125; //VK_DOWN;
//  else if(k == 0xfd1d) return (CGKeyCode); //VK_SNAPSHOT;
  else if(k == 0xff63) return (CGKeyCode)114; //VK_INSERT;
  else if(k == 0xffff) return (CGKeyCode)117; //VK_DELETE;
//  else if(k == 0xff67) return (CGKeyCode); //VK_APPS;
  else if(k == 'a') return (CGKeyCode)0;
  else if(k == 'b') return (CGKeyCode)11;
  else if(k == 'c') return (CGKeyCode)8;
  else if(k == 'd') return (CGKeyCode)2;
  else if(k == 'e') return (CGKeyCode)14;
  else if(k == 'f') return (CGKeyCode)3;
  else if(k == 'g') return (CGKeyCode)5;
  else if(k == 'h') return (CGKeyCode)4;
  else if(k == 'i') return (CGKeyCode)34;
  else if(k == 'j') return (CGKeyCode)38;
  else if(k == 'k') return (CGKeyCode)40;
  else if(k == 'l') return (CGKeyCode)37;
  else if(k == 'm') return (CGKeyCode)46;
  else if(k == 'n') return (CGKeyCode)45;
  else if(k == 'o') return (CGKeyCode)31;
  else if(k == 'p') return (CGKeyCode)35;
  else if(k == 'q') return (CGKeyCode)12;
  else if(k == 'r') return (CGKeyCode)15;
  else if(k == 's') return (CGKeyCode)1;
  else if(k == 't') return (CGKeyCode)17;
  else if(k == 'u') return (CGKeyCode)32;
  else if(k == 'v') return (CGKeyCode)9;
  else if(k == 'w') return (CGKeyCode)13;
  else if(k == 'x') return (CGKeyCode)7;
  else if(k == 'y') return (CGKeyCode)16;
  else if(k == 'z') return (CGKeyCode)6;
  else if(k == '0') return (CGKeyCode)29;
  else if(k == '1') return (CGKeyCode)18;
  else if(k == '2') return (CGKeyCode)19;
  else if(k == '3') return (CGKeyCode)20;
  else if(k == '4') return (CGKeyCode)21;
  else if(k == '5') return (CGKeyCode)23;
  else if(k == '6') return (CGKeyCode)22;
  else if(k == '7') return (CGKeyCode)26;
  else if(k == '8') return (CGKeyCode)28;
  else if(k == '9') return (CGKeyCode)25;
  else if(k == '`') return (CGKeyCode)10;
  else if(k == '-') return (CGKeyCode)27;
  else if(k == '=') return (CGKeyCode)24;
  else if(k == '[') return (CGKeyCode)33;
  else if(k == ']') return (CGKeyCode)30;
  else if(k == '\\') return (CGKeyCode)42;
  else if(k == ';') return (CGKeyCode)41;
  else if(k == '\'') return (CGKeyCode)39;
  else if(k == ',') return (CGKeyCode)43;
  else if(k == '.') return (CGKeyCode)47;
  else if(k == '/') return (CGKeyCode)44;
  return (CGKeyCode)0;
}
#endif



FB::variant SmoothGesturesPluginAPI::sendkeys(const FB::variant& keys) {
  FB::VariantList keyvector = keys.convert_cast<FB::VariantList>();

#ifdef __linux__
  Display *display;
  display = XOpenDisplay(NULL);
  if(display == NULL) return -1;
  unsigned int keycode;
#endif

  for(int i=0; i<keyvector.size(); i++) {
    std::vector<int> key = keyvector[i].convert_cast<std::vector<int> >();
    for(int j=0; j<key.size(); j++) {

#ifdef __linux__
      keycode = XKeysymToKeycode(display, key[j]);
      if(key.size() == 1 && key[j] != XKeycodeToKeysym(display, keycode, 0))
        XTestFakeKeyEvent(display, XKeysymToKeycode(display,0xffe1)/*LSHIFT*/, True, CurrentTime);
      XTestFakeKeyEvent(display, keycode, True, CurrentTime);
#endif

#ifdef _WIN32
      SendInput(1, &keyinput(key[j],1), sizeof(INPUT));
#endif

    }
    for(int j=key.size()-1; j>=0; j--) {

#ifdef __linux__
      keycode = XKeysymToKeycode(display, key[j]);
      XTestFakeKeyEvent(display, keycode, False, CurrentTime);
      if(key.size() == 1 && key[j] != XKeycodeToKeysym(display, keycode, 0))
        XTestFakeKeyEvent(display, XKeysymToKeycode(display,0xffe1)/*LSHIFT*/, False, CurrentTime);
#endif

#ifdef _WIN32
      SendInput(1, &keyinput(key[j],0), sizeof(INPUT));
#endif

    }
  }

#ifdef __linux__
  XCloseDisplay(display);
#endif

  return 0;
}




FB::variant SmoothGesturesPluginAPI::sendkey(const FB::variant& key, const FB::variant& mod1, const FB::variant& mod2) {
  int k = key.convert_cast<int>();
  int m1 = mod1.convert_cast<int>();
  int m2 = mod2.convert_cast<int>();

#ifdef __linux__
  Display *display;
  unsigned int keycode, mod1code, mod2code;
  display = XOpenDisplay(NULL);
  if(display != NULL) {
    if(m1 > 0) {
      mod1code = XKeysymToKeycode(display, m1);
      XTestFakeKeyEvent(display, mod1code, True, CurrentTime);
    }
    if(m2 > 0) {
      mod2code = XKeysymToKeycode(display, m2);
      XTestFakeKeyEvent(display, mod2code, True, CurrentTime);
    }
    keycode = XKeysymToKeycode(display, k);
    XTestFakeKeyEvent(display, keycode, True, CurrentTime);
    XTestFakeKeyEvent(display, keycode, False, CurrentTime);
    if(m1 > 0)
      XTestFakeKeyEvent(display, mod1code, False, CurrentTime);
    if(m2 > 0)
      XTestFakeKeyEvent(display, mod2code, False, CurrentTime);
    XCloseDisplay(display);
  }
#endif

#ifdef _WIN32
  if(m2 > 0) SendInput(1, &keyinput(m2,1), sizeof(INPUT));
  if(m1 > 0) SendInput(1, &keyinput(m1,1), sizeof(INPUT));
  SendInput(1, &keyinput(k,1), sizeof(INPUT));
  SendInput(1, &keyinput(k,0), sizeof(INPUT));
  if(m1 > 0) SendInput(1, &keyinput(m1,0), sizeof(INPUT));
  if(m2 > 0) SendInput(1, &keyinput(m2,0), sizeof(INPUT));
#endif

#ifdef __APPLE__
  CGEventFlags flags = 0;
  if(m1==0xffe1 || m2==0xffe1 || m1==0xffe2 || m2==0xffe2)
    flags |= kCGEventFlagMaskShift;
  if(m1==0xffe3 || m2==0xffe3 || m1==0xffe4 || m2==0xffe4)
    flags |= kCGEventFlagMaskControl;
  if(m1==0xffe7 || m2==0xffe7 || m1==0xffe8 || m2==0xffe8
  || m1==0xffeb || m2==0xffeb || m1==0xffec || m2==0xffec
  || m1==0xffed || m2==0xffed || m1==0xffee || m2==0xffee)
    flags |= kCGEventFlagMaskAlternate;
  if(m1==0xffe9 || m2==0xffe9 || m1==0xffea || m2==0xffea)
    flags |= kCGEventFlagMaskCommand;
  CGEventRef down = CGEventCreateKeyboardEvent(NULL, getkeycode(k), true);
  CGEventRef up = CGEventCreateKeyboardEvent(NULL, getkeycode(k), false);
  CGEventSetFlags(down, flags);
  CGEventPost(kCGSessionEventTap, down);
  CGEventPost(kCGSessionEventTap, up);
#endif

  return 0;
}










FB::variant SmoothGesturesPluginAPI::sendbutton(const FB::variant& button) {
  int b = button.convert_cast<int>();

#ifdef __linux__
  Display *display;
  display = XOpenDisplay(NULL);
  if(display != NULL) {
    XTestFakeButtonEvent(display, b, True, CurrentTime);
    XTestFakeButtonEvent(display, b, False, CurrentTime);
    XCloseDisplay(display);
  }
#endif

#ifdef _WIN32
  SendInput(1, &mouseinput(b,1), sizeof(INPUT));
  SendInput(1, &mouseinput(b,0), sizeof(INPUT));
#endif

#ifdef __APPLE__
  CGPoint mouseLoc = CGEventGetLocation(CGEventCreate(NULL));
  CGEventRef down = CGEventCreateMouseEvent(NULL, (b==0?kCGEventLeftMouseDown:
                                                  (b==1?kCGEventOtherMouseDown:
                                                        kCGEventRightMouseDown)), mouseLoc, b==1?kCGMouseButtonCenter:NULL);
  CGEventRef up   = CGEventCreateMouseEvent(NULL, (b==0?kCGEventLeftMouseUp:
                                                  (b==1?kCGEventOtherMouseUp:
                                                        kCGEventRightMouseUp)), mouseLoc, b==1?kCGMouseButtonCenter:NULL);
  CGEventPost(kCGSessionEventTap, down);
  CGEventPost(kCGSessionEventTap, up);
  CFRelease(down);
  CFRelease(up);
#endif

  return 0;
}








