; UIA functions for use with reaper,  but others can use it too

include "HJConst.jsh"
include "uia.jsh"


globals
	object jlfs,
	object jlcw,
	int jlID
	
	
	

Function uInit ()
var
	handle hMain,
	object oApp
	
jlFS = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" );
if (!jlfs) then
	SayString ("jlfs failed ")
endif

Let hMain = GetAppMainWindow (GetFocus())
Let oApp = jlFS.GetElementFromHandle(hMain)
if (!oApp) then
;	SayString ("jlo failed ")
	return
endif

jlcW = jlFS.ControlViewWalker 
if (!jlcw) then
	SayString ("jlcw failed ")
endif

jlcw.currentElement = oApp
EndFunction



Object Function uGetFocus ()
var
	object oFocus

Let oFocus = jlfs.GetFocusedElement()
jlcw.currentElement = oFocus
return (oFocus)
EndFunction


Object Function uFirstChild (object oStart)
var
	object jlo,
	object oNull

Let jlcw.currentElement =	oStart
if (jlcw.gotoFirstChild()) then
	Let jlo = jlcw.currentElement
	return (jlo)
else
	return (oNull)
endif
EndFunction


Object Function uParent (object oStart)
var
	object jlo,
	object oNull
	
Let jlcw.currentElement =	oStart
if (jlcw.gotoParent()) then
	Let jlo = jlcw.currentElement
	return (jlo)
else
	return oNull
endif
EndFunction


Object Function uNextSibling (object oStart)
var
	object jlo,
	object oNull
	
Let jlcw.currentElement =	oStart
if (jlcw.gotoNextSibling()) then
	Let jlo = jlcw.currentElement
	return (jlo)
else
	return (oNull)
endif
EndFunction


Object Function uPriorSibling (object oStart)
var
	object jlo,
	object oNull
	
Let jlcw.currentElement =	oStart
if (jlcw.gotoPriorSibling()) then
	Let jlo = jlcw.currentElement
	return (jlo)
else
	return (oNull)
endif
EndFunction


Object Function uLastSibling (object oStart)
var
	object o1,
	object o2
	
Let o2 = oStart
While (o2)
	Let o1 = o2
	Let o2 = uNextSibling (o1)
endWhile
return (o1)
EndFunction


Object Function uObjectAtPoint ()
var
	object jlo,
	int x,
	int y

Let x = GetCursorCol()
Let y = GetCursorRow()
jlo = jlfs.GetElementFromPoint (x, y)
jlcw.currentElement = jlo
return (jlo)
EndFunction


Function uGetValuePattern (object oStart)
var
	object oValue
	
Let oValue = oStart.GetValuePattern()
return (oValue)
EndFunction


Function uSetValue (object oValue, string sValue)
var
	int status = 0
	
if (oValue) then
	if (oValue.setValue(sValue)) then
		Let status = 1
	endif
endif
return (status)	
EndFunction

Object Function uTraverse (object oStart, string sPath)
; move from one point in an object tree to another.
; sPath is verticalb are separated lists of steps.
; each step is a direction letter,  followed by an interation count.
; directions are:
;  u = move to parent
;  d = move to first child
; p = move to prior siglinb
; n = next sibling
; example: "u2|n3|d1", up 2 levesl, n3xt 3 siblings,  then descend 1 level
var
	object o,
	object oNull,
	int i,
	int segmentCount,
	string sDir,
	string sSegment,
	string sCount,
	int iCount

Let segmentCount = StringSegmentCount (sPath, "|")
Let i = 1
while (i <= segmentCount) ; for each segmetn in the path
	Let sSegment = StringSegment (sPath, "|", i)
	Let sDir = StringLeft (sSegment, 1)
	Let sCount = stringChopLeft (sSegment, 1)
 Let iCount = StringToInt (sCount)
 While (iCount > 0)
		; move one step
		if (sDir == "u") then
			Let o = uParent (o)
		elif (sDir == "d") then
			Let o = uFirstChild (o)
		elif (sDir == "p") then
			Let o = uPriorSibling (o)
		elif (sDir == "n") then
			Let o = uNextSibling (o)
		endif
		if (not o) then
			return (oNull)
		endif
		Let iCount = iCount-1
	endWhile
	Let i = i+1
EndWhile
return (o)
EndFunction

