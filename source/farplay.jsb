JFW Script File                                                          �'  Snow_uia.jsb P     $scriptfilename      FarPlay scripts, version C    saystring         4     autostartevent        &  fplastgroupname    �    $hotkeyhelp      (   1 e FarPlay hot key help:
Focus on a user's controls, %keyfor(FocusUsersControl)
Speak the currently focused username, or panel, %keyfor(SpeakCurrentUserName)
Mix Volumes tabbing, Focus on a users  level slider,  and use control+shift+left and right arrows to move between users.
Session Controls Focus = %keyfor(FocusOnSession)
Tools Focus, press %keyfor(FocusOnTools)
Press escape to close this message      saymessage        l     beeperror           getjawssettingsdirectory      \HotSpotDing.wav    
    playsound             logchatmessage           '     %     <b>   stringcontains  '  %       
        %     </b>      stringcontains  '  %       
     %       
  '     %   %  %  %  
    substring   '     %     </font>   stringcontains  '  %       
     %       
  '     %   %    stringchopleft  '       %1 says: %2 %  %    formatstring    '     %    saystring           '  %    |   
  $  jamuluschathistory  
  &  jamuluschathistory     $  jamuluschathistory    |     stringsegmentcount    
   
          '  %    
   
     %     $  jamuluschathistory    |   %    stringsegment   
    |   
  '  %       
  '   P   %  &  jamuluschathistory              %     	      �     uianotificationevent          %        
     %       
        %    logchatmessage     	               %   %  %  %    uianotificationevent          H    announcecontrolname          '        '       ugetfocus   '     %    uparent '  %      classname   '  %    QGroupBox   
     %      name    '  %  $  fplastgroupname 
          '     %    saystring      %  &  fplastgroupname       %      name    '     %    stringisblank        %  %  
  " |%        
  
        %    saystring         %      classname   '  %      localizedcontroltype    ' 	 %    QCheckBox   
  " <%    QPushButton 
  # 8% 	   check box   
  
  
          controlischecked            checked   saystring              not checked   saystring            %    QSlider 
     %      getvaluepattern ' 
 % 
     value   '     %    saystring              '     %     	      x     focuschangedevent          %     announcecontrolname    	         %   %    focuschangedevent         d    finduserlevel           uinit      $  jlcw        currentelement  '     %    ufirstchild '     %    unextsibling    '  %        
        %    unextsibling    '     %    unextsibling    '  %        
  '    �       %    ufirstchild '     %    ufirstchild '     %    ufirstchild '  %     	      |     thisisauser         '       Devices|Session|Tools   %     stringcontains           '     %     	      0     $nextuser        movetonextuser        0     $prioruser       movetoprioruser       �    movetonextuser        '        ugetfocus   '     %    uparent '  %  '     %    unextsibling    '  %            beeperror      	      %      name    '     %    thisisauser       %    focusthisuserobject          %    u3|n2|d3      utraverse   '  %        %    focusthisuserobject            beeperror            %      	      �    movetoprioruser       '        ugetfocus   '     %    uparent '  %  '     %    upriorsibling   '  %          %    u3    utraverse   '  %      classname   '  %    QScrollArea 
        %    p2|d3|n1      utraverse   '          beeperror      	         %      name    '     %    focusthisuserobject    %      	      �    getlistofusers      � �     '  %        
       Mute    '    muted   '    unMuted '     %        
       Solo    '    soloed  '    unSoloed    '           '        '       '  %       
        %    finduserlevel   ' 	 % 	 ' 
 % 
    % 
     name    '       Devices|Session|Tools   %    stringcontains        
        %    stringisblank        NoName     %    inttostring 
  '  %       
  '        % 
   ufirstchild '     %    ulastsibling    '  %     %      classname   '  %    QSlider 
     %  %  %  /       null    '        %    unextsibling    '      (     n/a '  %     %      classname   '  %    FpLatencyDisplay    
        %    ufirstchild '  %      name    '       null    '        %    upriorsibling   '      �      %    stringisblank        n/a '     %       %1: %2| %  %    formatstring    
  '  %       
  '     % 
   unextsibling    ' 
         null    ' 
         %       
  '   �       %         stringchopright '  %     	          focusthisuserobject       %     ufirstchild '  %     %      classname   '  %    QSlider 
     %      setfocus          %    saystring           null    '        %    unextsibling    '  %      classname   '      8       T     $speakcurrentusername           getcurrentusername    saystring             getcurrentusername       ugetfocus   '      %     uparent '   %       name    '     %    ,     stringcontains  '  %        
        %    stringlength         
  '        %  %       
    stringleft  '  %     	      �    findthisuser                 finduserlevel   '    2   '  %        
        %    ufirstchild '     %    unextsibling    '     %    unextsibling    '  %      name    '     %    ,     stringcontains  '  %        
        %    stringlength         
  '        %  %       
    stringleft  '  %  %   
     %     	         %    unextsibling    '  %       %     	      %       
  '   H    %     	      X     $focusondevices     	 focus on devices does not work yet    saystring         �     $focusonsession      Session   QLabel    focuspanel  '        pause         %     unextsibling    '   %       name    '     %    spellstring       p     $focusontools        Tools     QPushButton   focuspanel  '        tools     saystring         �    focuspanel                finduserlevel   '     %    ulastsibling    '  %     %      name    '  %  %   
        %    ufirstchild '  %     %      classname   '  %  %  
     %      setfocus       %     	         %    unextsibling    '      �          %    upriorsibling   '   \       %      not found  
    saystring      %     	      �     $test                   ugetfocus     uparent '   %       name    '       was:    %  
    saystring      	         �    $focususerscontrol  -   '            %  %     getlistofusers  '  1  Pick a user name, and press enter to focus on that person's controls      |   
  %  
  '     %    UserFocus                dlgselectiteminlist '  %       
        %    |   %    stringsegment   '     %    :          stringsegment   '  %  %   .  '  %      setfocus             %     delete        H    $readchathistory         getcurrentscriptkeyname '         %          stringright   stringtoint '  %        
       
   '        $  jamuluschathistory    |   %    stringsegment   '     %    stringisblank       	 not that many chat messages found   '        %    saystring         X    populatelist    $  populatelistinputjm '     ToggleMute(|ToggleSolo( '       userbufferdeactivate            userbufferclear         speechon       %        
          no users found    saystring      	           '  %  %  
        %    |   %    stringsegment   '     %    |   %     stringsegment      %    inttostring 
    )   
  '     %  %    userbufferaddtext      %       
  '   �         userbufferactivate        $  bufferlinejm      gotolinenumber          sayLine         schedulefunction          H     userbufferdeactivatedevent       closed    saystring         �    $makecolorreport         isjawscursor              jaws cursor is not active,  report canceled   saystring      	           ugetfocus   '   %       name    '     %    Local mix     stringstartswith              not position on a Local Mix slider.  Report Canceled.     saystring      	              getfocus      getappmainwindow    '     %  %  %  %  %    getwindowrect         %    getwindowname   '    Main window     %  
    
  
  '  %       x: %1-%2
y: %3-%4
       %    inttostring    %    inttostring    %    inttostring    %    inttostring   formatstring    
  '       getcursorcol    '       getcursorrow    ' 	 %       cursor: %1 %2
    %    inttostring    % 	   inttostring   formatstring    
  '     %  % 	   getcoloratpoint ' 
           delay         %  % 	   getcoloratpoint '            delay         %  % 	   getcoloratpoint '  %       colors: %1 %2 %3
     % 
   inttostring    %    inttostring    %    inttostring   formatstring    
  '     %   %  %  %  %    getboundingrect    %       slider x: %1-%2
    y: %3-%4
    %    inttostring    %    inttostring    %    inttostring    %    inttostring   formatstring    
  '     %    copytoclipboard        	 cursor report copied to clipboard     saystring         