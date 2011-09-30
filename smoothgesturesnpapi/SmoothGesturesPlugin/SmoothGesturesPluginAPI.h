/**********************************************************\

  Auto-generated SmoothGesturesPluginAPI.h

\**********************************************************/

#include <string>
#include <sstream>
#include <boost/weak_ptr.hpp>
#include "JSAPIAuto.h"
#include "BrowserHost.h"
#include "SmoothGesturesPlugin.h"

#ifndef H_SmoothGesturesPluginAPI
#define H_SmoothGesturesPluginAPI

class SmoothGesturesPluginAPI : public FB::JSAPIAuto
{
public:
    SmoothGesturesPluginAPI(SmoothGesturesPluginPtr plugin, FB::BrowserHostPtr host);
    virtual ~SmoothGesturesPluginAPI();

    SmoothGesturesPluginPtr getPlugin();
    std::string get_version();

    FB::variant sendkeys(const FB::variant& keys);
    FB::variant sendkey(const FB::variant& key, const FB::variant& mod1, const FB::variant& mod2);
    FB::variant sendbutton(const FB::variant& button);

private:
#ifdef _WIN32
    INPUT mouseinput(int b, bool down);
    INPUT keyinput(int k, bool down);
#endif

#ifdef __APPLE__
    CGKeyCode getkeycode(int k);
#endif

    SmoothGesturesPluginWeakPtr m_plugin;
    FB::BrowserHostPtr m_host;
};

#endif // H_SmoothGesturesPluginAPI

