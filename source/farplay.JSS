; Scripts for FarPlay ,  the online Jamming program
; started by Snowman

Include "HJConst.jsh"
include "msaa.jsh"
include "FarPlay.jsm"

Use "Snow_uia.jsb"


globals
	string FPLastGroupName,
	int PopulateListInputJM, ; input argument for a scheduled function
	int BufferLineJM,
	string JamulusChatHistory,
	object jlo,
	object jlcw
	

script ScriptFileName()
SayString ("FarPlay scripts, version C")
EndScript

Function AutoStartEvent ()
FPLastGroupName = ""
endFunction

Script HotKeyHelp()
;jawsKey+h
SayMessage (OT_USER_BUFFER, msgHotKeyHelp)
EndScript


Function BeepError ()
; play a beep
PlaySound (GetJAWSSettingsDirectory () + "\\HotSpotDing.wav")
EndFunction


Int Function LogChatMessage (string sMessage)
; not currently used
; remove the markup from this user message,  and add it to the log
var
	int status = 0,
	int i,
	int j,
	string s,
	string sContents,
	string sText,
	string sUser

Let i = StringContains (sMessage, "<b>")
if (i > 1) then
	Let j = StringContains (sMessage, "</b>")
	if (j > 2) then
		; get past the markup tabs
		Let i = i+3
		Let sUser = SubString (sMessage, i, (j-i))
		; extract the message
		Let i = StringContains (sMessage, "</font>")
		if (i > 1) then
			; move past the font tag
			Let i = i+6
			Let sText = stringChopLeft (sMessage, i)
			Let sContents = FormatString ("%1 says: %2", sUser, sText)
			SayString (sContents)
			Let status = 1 ; tell the caller we did it
			; add this to the log,  then limit the log to ten entries
			Let JamulusChatHistory = sContents + "|" + JamulusChatHistory
			if (StringSegmentCount (JamulusChatHistory, "|") > 10) then
				; time to compact
				for i = 1 to 10
					Let s = s + StringSegment (JamulusChatHistory, "|", i) + "|"
				EndFor
				Let JamulusChatHistory = s
			endif
		endif
	endif
endif
return (status)
EndFunction


void function UIANotificationEvent (int notificationKind, int notificationProcessing, string displayString, string activityID)
/*
SayDebugIntJLS ("notificationKind", notificationKind) ;@@@test
SayDebugIntJLS ("notificationProcessing", notificationProcessing) ;@@@test
SayDebugStringJLS ("displayString", displayString) ;@@@test
SayDebugStringJLS ("activityID", activityID) ;@@@test
*/

if (notificationKind == 4) then
	if (notificationProcessing == 1) then
		; we think this is a chag message.
		if (LogChatMessage (displayString)) then
			return
		endif
	endif
endif

UIANotificationEvent (notificationKind, notificationProcessing, displayString, activityID)
EndFunction


Int Function AnnounceControlName (handle hFocus)
; runs when focus changes,  decide what to say
var 
	string controlType,
	object oValue,
	string sValue,
	int groupSpoken = 0,
	int status = 0,
	object oFocus,
	object oGroup,
	string groupName,
	string groupClass,
	string class,
	string name
	
Let oFocus = uGetFocus()
Let oGroup = uParent (oFocus)
Let groupClass = oGroup.className
if (groupClass == "QGroupBox") then
	Let groupName = oGroup.name
	if (groupName != FPLastGroupName) then
		Let groupSpoken = 1
		SayString (groupName)
		Let FPLastGroupName = groupName
	endif
endif ; a groupbox

Let name = oFocus.name
if (not StringIsBlank (name)) then
	if (   (name != groupName)
				|| (groupSpoken == 0)) then
		SayString (name)
	endif
	Let class = oFocus.ClassName

	Let controlType = oFocus.localizedControlType

if (  (class == "QCheckBox")
			|| (   (class == "QPushButton")
			    && (controlType == "check box"))) then
		if (ControlIsChecked ()) then
			SayString ("checked")
		else
			SayString ("not checked")
		endif
	elif (class == "QSlider") then
		Let oValue = oFocus.GetValuePattern()
		Let sValue = oValue.value
		SayString (sValue)
	endif

	Let status = 1
endif
return (status)
EndFunction

Function FocusChangedEvent (handle hFocus, handle hPrevious)
; runs when focus changes
if (AnnounceControlName (hFocus)) then
	return
endif


FocusChangedEvent (hFocus, hPrevious)
EndFunction

Object Function FindUserLevel (int index)
; dig from the top of the app, down to a point where there is one object per user.
; these are broken into two separate UIA objects.
; supply index 1 or 2 
; return the first object in that list,  or null
var
	int i,
	string class,
	object o,
	object oNull

uInit() ;  in snow_uia,  creates jlfs and jlcw
; get the top level object for this application
Let o = jlcw.CurrentElement
Let o = uFirstChild (o)
Let o = uNextSibling (o)
while (index > 1)
	Let o = uNextSibling (o)
	Let o = uNextSibling (o)
	Let index = index-1
endWhile

Let o = uFirstChild (o)
Let o = uFirstChild (o)
Let o = uFirstChild (o)
return (o)
EndFunction



Int Function ThisIsAUser (string UserName)
; test this name against the list of known general control panels
var
	int status = 1

if (StringContains ("Devices|Session|Tools", UserName)) then
	Let status = 0
endif
Return (status)
EndFunction


Script NextUser ()
MoveToNextUser ()
EndScript


Script PriorUser ()
MoveToPriorUser ()
EndScript


	
Function MoveToNextUser ()
; you must be focused on a user's personal mix controls.
; move to the next user if possible
var
	string name,
	int status = 0,
	object oFocus,
	object o,
	object oUser
	
Let oFocus = uGetFocus()
Let oUser = uParent (oFocus)
Let o = oUser
Let oUser = uNextSibling (oUser)
; the session group ends with devices, session tools, not null
if (not oUser) then
	; end of scroll area
	BeepError()
	return
endif
Let name = oUser.name
if (ThisIsAUser (name)) then
	FocusThisUserObject (oUser)
else
	; move to the scroll area
	; o is at the user level
	Let o = uTraverse (o, "u3|n2|d3")
	if (o) then
		FocusThisUserObject (o)
	else
;		PerformScript SpeakCurrentUserName()
		BeepError()
	endif
endif	
	
return (status)
EndFunction

Function MoveToPriorUser ()
; you must be focused on a user's personal mix controls.
; move to the prior user if possible
var
	string class,
	string name,
	int status = 0,
	object oFocus,
	object o,
	object oUser
	
Let oFocus = uGetFocus()
Let oUser = uParent (oFocus)
Let o = oUser
Let oUser = uPriorSibling (oUser)
if (not oUser) then
	; if in the scoll area, we need to move to the session list
	Let o = uTraverse (o, "u3")
	Let class = o.className
	if (class == "QScrollArea") then
		; this is the scroll area,  so move to the other list
		Let oUser = uTraverse (o, "p2|d3|n1")
	else
		; we were already in that session list
;		PerformScript SpeakCurrentUserName()
		BeepError()
		return
	endif
endif
Let name = oUser.name
FocusThisUserObject (oUser)

return (status)
EndFunction

String Function GetListOfUsers (int includeStatus, int ByRef userCount, collection ByRef UserControls)
; get a list of users.
; IncludeStatus is no longer used
; UserCount returns the number o fusrs found
; UserControls is a collection created here, the object to be clicked to bring focus to this user
; that collection is usernames and returns object references
; returns: vertical separated list of user names and latencies
var
	object oSlider,
	int index,
	int noNameCount = 1,
	int iState,
	string sState,
	string sSelected,
	string sUnselected,
	object oLatency,
	string sLatency,
	string sOut,
	int i,
	object oUser,
	object oLegacy,
	object o,
	string name,
	string class,
	string expectedStatus 
	
if (includeStatus == 1) then
	Let expectedStatus = "Mute "
	Let sSelected = "muted"
	Let sUnselected = "unMuted"
elif (includeStatus == 2) then
	Let expectedStatus = "Solo "
	Let sSelected = "soloed"
	Let sUnselected = "unSoloed"
endif
	
Let userCount = 0
Let sOut = ""
Let index = 1
while (index < 3)
	Let o = FindUserLevel	(index)
	; seems to be one object at this level per user
	Let oUser = o
	while (oUser)
		; get the name and latency
		Let name = oUser.name
		if (StringContains ("Devices|Session|Tools", name) == 0) then
			if (StringIsBlank (name)) then
				Let name = "NoName" + IntToString (nonameCount)
				Let noNameCount = noNameCount+1
			endif
			; Get the level control object in case we want to set focus there
			Let oSlider = uFirstChild (oUser)
			Let oLatency = uLastSibling (oSlider)
			; scan for the level slider
			while (oSlider)
				Let class = oSlider.className
				if (class == "QSlider") then
					Let UserControls[name] = oSlider
					Let oSlider = null()
				else
					Let oSlider = uNextSibling (oSlider)
				endif
			EndWhile
			
			; get the latency for this user
			; oLatency was initialized above
			Let sLatency = "n/a"
			While (oLatency)
				Let class = oLatency.className
				if (class == "FpLatencyDisplay") then
					Let oLatency = uFirstChild (oLatency)
					Let sLatency = oLatency.name
					Let oLatency = null()
				else
					Let oLatency = uPriorSibling (oLatency)
				endif
			endWhile
			; if none found
			if (StringIsBlank (sLatency)) then
				Let sLatency = "n/a"
			endif
			Let sOut = sOut + FormatString ("%1: %2|", name, sLatency)
			Let userCount = userCount + 1
			Let oUser = uNextSibling (oUser)
		else
			; devices, session or tools
			Let oUser = NULL()
		endif
	EndWhile
	Let index = index+1
EndWhile

; chop the last vertical bar
Let sOut = StringChopRight (sOut, 1)
return (sOut)
EndFunction


Function FocusThisUserObject (object oUser)
; put focus on the first of this user's controls
; provide the groupBox object for this user
var
	string class,
	string name,
	object o,
	int i
	
; now find volume slider and set focus there
Let o = uFirstChild (oUser)
; Make sure this is the slider 
while (o)
	Let class = o.className
	if (class == "QSlider") then
		o.SetFocus()
		sayString (name)
		Let o = Null()
	else
		Let o = uNextsibling (o)
		Let class = o.className
	endif
endWhile
EndFunction


Script SpeakCurrentUserName ()
SayString (GetCurrentUserName())
EndScript

String Function GetCurrentUserName ()
; when focus is among the controls for a particular user,  obtain their name
; so,  this one depends on focus
var
	int i,
	string name,
	string userName,
	object o
	
Let o = uGetFocus()
Let o = uParent (o)
Let name = o.name
Let i = StringContains (name, ",")
if (i == 0) then
	Let i = StringLength (name)+1
endif
Let username = StringLeft (name, i-1)
return (userName)
EndFunction


Object Function FindThisUser (string userName)
; not currently used
var
	int safety,
	int i,
	string name,
	object oNull,
	object oUser,
	object o
	
Let oUser = FindUserLevel (1)
Let safety = 50
while (safety > 0)
	; get this user's name
	Let o = uFirstChild (oUser)
	Let o = uNextSibling (o)
	Let o = uNextSibling (o)
	Let name = o.name
	Let i = StringContains (name, ",")
	if (i == 0) then
		Let i = StringLength (name)+1
	endif
	Let name = stringLeft (name, i-1)
	if (name == userName) then
		return (oUser)
	endif
	
	Let oUser = uNextSibling (oUser)
	if (not oUser) then
		return (oUser)  ; which is null
	endif
	Let safety = safety-1
endWhile

return (oNull)
EndFunction






Script FocusOnDevices ()
; put focus in the Devices panel,  this does not work yet
var
	object o
	SayString ("focus on devices does not work yet")
; Let o = FocusPanel ("Devices", "FpComboBox")
EndScript


Script FocusOnSession ()
; put focus on the session controls
var
	string sessionID,
	object o
	
Let o = FocusPanel ("Session", "QLabel")
Pause()
; speak thesession ID
Let o = uNextSibling (o) 
Let sessionID = o.name
SpellString (sessionID)
EndScript


Script FocusOnTools ()
; put focus in the tools panel
var
	object o
	
Let o = FocusPanel ("Tools", "QPushButton")
SayString ("tools")
EndScript



Function FocusPanel (string PanelName, string FocusableClass)
; puts focus on one of the panels such as Devices,  Session and Tools
; provide the name of the panel you want
;  and the class of the first object that is focusable
var
	int safety,
	object o,
	string class,
	string name
	
Let o = FindUserLevel(1)
Let o = uLastSibling (o)
while (o) 
	Let name = o.name
	if (name == panelName) then
		Let o = uFirstChild (o)
		; move across to find something that is focusable
		while (o)
			Let class = o.className
			if (class == focusableClass) then
				o.SetFocus()
				return (o)
			else
				Let o = uNextSibling (o)
			endif
		endWhile
	endif
	Let o = uPriorSibling (o)
endWhile
SayString  (panelName + " not found")
return (o)
EndFunction

	
Script test ()
; general purpose test script
var
	object o,
	int i,
	int l,
	int r,
	int t,
	int b,
	string sOut

if (1) then
	Let o = uParent (uGetFocus ())
	; Let o = uLastSibling(o)
	Let sOUt = o.name
	SayString ("was: " + sOut)
		return
	endif
	
EndScript

Script FocusUsersControl ()
; control+shift+f6 gets a list of users, select one and press enter to access their controls 
var
	string sList,
	string sUsers,
	int userCount,
	string name,
	object oSlider,
	collection UserControls,
	int i

Let UserControls = new collection
Let sList = GetListOfUsers(0, userCount, userControls) 
Let sList = msgFocusUser + "|"  + sList
Let i = dlgSelectItemInList (sList, "UserFocus", 0, 1)
if (i > 1) then
	; user was chosen, 
	Let name = StringSegment (sList, "|", i)
	Let name = StringSegment (name, ":", 1)
	Let oSlider = UserControls[name]
 oSlider.setFocus()
endif	
Delete (UserControls)
EndScript


Script ReadChatHistory ()
var
	string s,
	string sKey,
	int iKey
	
	
Let sKey = GetCurrentScriptKeyName ()
Let iKey = StringToInt (StringRight (sKey, 1)) ; just the number

; translate 1-9 and 0,  to 1-10
if (iKey == 0) then
	Let iKey = 10
endif
Let s = StringSegment (JamulusChatHistory, "|", iKey)
if (StringIsBlank (s)) then
	Let s = "not that many chat messages found"
endif
SayString (s)	
EndScript


Function PopulateList ()
; since this is a scheduled function, the input must be passed via a global
; supply 1=mute,  or 2=solo
var 
	string sList,
	int userCount,
	string s,
	int i,
	string toggleFunctions,
	int includeStatus,
	string functionName
	
Let includeStatus = PopulateListInputJM	
Let toggleFunctions = "ToggleMute(|ToggleSolo("
	
UserBufferDeactivate ()
UserBufferClear ()
SpeechOn()
; Let sList = GetListOfUsers (includeStatus, userCount)
if (userCount <= 0) then
	SayString ("no users found")
	return
endif

Let i = 1
While (i <= userCount)
	Let s = StringSegment (sList, "|", i)
	Let functionName = StringSegment (toggleFunctions, "|", includeStatus) + IntToString (i) + ")"
	UserBufferAddText (s, functionName)
	Let i = i+1
endWhile
UserBufferActivate ()	
GotoLineNumber (BufferLineJM)
ScheduleFunction ("sayLine", 0)
EndFunction




function UserBufferDeactivatedEvent ()
SayString ("closed")
EndFunction




	Script MakeColorReport ()
var
	object o,
	handle h,
	string sOut,
	string name,
	int c1,
	int c2,
	int c3,
	int l,
	int r,
	int t,
	int b,
	int x,
	int y

if (not IsJAWSCursor ()) then
	SayString ("jaws cursor is not active,  report canceled")
	return
endif

Let o = uGetFocus()
Let name = o.name
if (not StringStartsWith (name, "Local mix")) then
	SayString ("not position on a Local Mix slider.  Report Canceled.")
	return
endif


Let h = GetAppMainWindow (GetFocus())
GetWindowRect (h, l, r, t, b)
Let name = getWindowName (h)

Let sOut = "Main window " + name + "\r\n"
Let sOut = sOut + FormatString ("x: %1-%2\r\ny: %3-%4\r\n", intToString(l), intToString(r), intToString(t), intToString(b))

Let x = GetCursorCol()
Let y = GetCursorRow()
Let sOut = sOut + FormatString ("cursor: %1 %2\r\n", IntToString(x), intToString (y))

Let c1 = GetColorAtPoint (x, y)
delay(3)
Let c2 = GetColorAtPoint (x, y)
delay(3)
Let c3 = GetColorAtPoint (x, y)

Let sOut = sOut + FormatString ("colors: %1 %2 %3\r\n", intToString(c1), intToString(c2), intToString(c3))

; object coords
GetBoundingRect (o, l, t, r, b)
Let sOut = sOut + FormatString ("slider x: %1-%2\r\n    y: %3-%4\r\n", intToString(l), intToString(r), intToString(t), intToString(b))

CopyToClipboard (sOut)
Saystring ("cursor report copied to clipboard")


EndScript
