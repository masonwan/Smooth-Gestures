/**********************************************************\

  Auto-generated SmoothGesturesPlugin.cpp

  This file contains the auto-generated main plugin object
  implementation for the Smooth Gestures: Plugin project

\**********************************************************/

#include "NpapiTypes.h"
#include "SmoothGesturesPluginAPI.h"

#include "SmoothGesturesPlugin.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn SmoothGesturesPlugin::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginInitialize()
///
/// @see FB::FactoryBase::globalPluginInitialize
///////////////////////////////////////////////////////////////////////////////
void SmoothGesturesPlugin::StaticInitialize()
{
    // Place one-time initialization stuff here; note that there isn't an absolute guarantee that
    // this will only execute once per process, just a guarantee that it won't execute again until
    // after StaticDeinitialize is called
}

///////////////////////////////////////////////////////////////////////////////
/// @fn SmoothGesturesPlugin::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginDeinitialize()
///
/// @see FB::FactoryBase::globalPluginDeinitialize
///////////////////////////////////////////////////////////////////////////////
void SmoothGesturesPlugin::StaticDeinitialize()
{
    // Place one-time deinitialization stuff here
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  SmoothGesturesPlugin constructor.  Note that your API is not available
///         at this point, nor the window.  For best results wait to use
///         the JSAPI object until the onPluginReady method is called
///////////////////////////////////////////////////////////////////////////////
SmoothGesturesPlugin::SmoothGesturesPlugin()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  SmoothGesturesPlugin destructor.
///////////////////////////////////////////////////////////////////////////////
SmoothGesturesPlugin::~SmoothGesturesPlugin()
{
}

void SmoothGesturesPlugin::onPluginReady()
{
    // When this is called, the BrowserHost is attached, the JSAPI object is
    // created, and we are ready to interact with the page and such.  The
    // PluginWindow may or may not have already fire the AttachedEvent at
    // this point.
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  Creates an instance of the JSAPI object that provides your main
///         Javascript interface.
///
/// Note that m_host is your BrowserHost and shared_ptr returns a
/// FB::PluginCorePtr, which can be used to provide a
/// boost::weak_ptr<SmoothGesturesPlugin> for your JSAPI class.
///
/// Be very careful where you hold a shared_ptr to your plugin class from,
/// as it could prevent your plugin class from getting destroyed properly.
///////////////////////////////////////////////////////////////////////////////
FB::JSAPIPtr SmoothGesturesPlugin::createJSAPI()
{
    // m_host is the BrowserHost
    return FB::JSAPIPtr(new SmoothGesturesPluginAPI(FB::ptr_cast<SmoothGesturesPlugin>(shared_ptr()), m_host));
}

bool SmoothGesturesPlugin::onMouseDown(FB::MouseDownEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse down at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool SmoothGesturesPlugin::onMouseUp(FB::MouseUpEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse up at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool SmoothGesturesPlugin::onMouseMove(FB::MouseMoveEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse move at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}
bool SmoothGesturesPlugin::onWindowAttached(FB::AttachedEvent *evt, FB::PluginWindow *)
{
    // The window is attached; act appropriately
    return false;
}

bool SmoothGesturesPlugin::onWindowDetached(FB::DetachedEvent *evt, FB::PluginWindow *)
{
    // The window is about to be detached; act appropriately
    return false;
}

