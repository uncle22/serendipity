import Qt 4.7


Item {
    id: systemmenu
    property real uiScale: 1.0
    property int  maxWidth: 300 * uiScale
    property int  maxHeight: 410 * uiScale
    property int  headerIdent:   14 * uiScale
    property int  subItemIdent:  16 * uiScale
    property int  dividerWidthOffset: 28 * uiScale
    property int  itemIdent:     subItemIdent + headerIdent
    property int  edgeOffset: 11 * uiScale
    property bool flickableOverride: false

    property bool airplaneModeInProgress: false

    width: maxWidth; height: maxHeight;

    // ------------------------------------------------------------
    // External interface to the System Menu is defined here:


    // ---- Signals ----
    signal closeSystemMenu()
    signal airplaneModeTriggered()
    signal rotationLockTriggered(bool isLocked)
    signal muteToggleTriggered(bool isMuted)
    signal menuBrightnessChanged(real value, bool save)

    function setHeight(newheight) {
        if(newheight <= maxHeight) {
            height = newheight;
        }
        else {
            height = maxHeight;
        }
        // WORK-AROUND: changing the height directly was not causing atYEnd to update.. this pokes it
        flickableArea.resizeContent(flickableArea.contentWidth, flickableArea.contentHeight, 0.0);
    }

    function setUiScale(scale) {
        uiScale = scale;
    }

    function setMaximumHeight(height) {
        maxHeight = height;
    }

    function updateDate() {
        date.updateDate();
    }

    function setRotationLockText(newText, showLocked) {
        if(!rotation.delayUpdate) {
            rotation.modeText      = newText;
            rotation.locked        = showLocked;
        } else {
            rotation.newText       = newText;
            rotation.newLockStatus = showLocked;
        }
    }

    function setMuteControlText(newText, showMuteOn) {
        if(!muteControl.delayUpdate) {
            muteControl.muteText      = newText;
            muteControl.mute          = showMuteOn;
        } else {
            muteControl.newText       = newText;
            muteControl.newMuteStatus = showMuteOn;
        }
    }

    function setAirplaneModeStatus(newText, state) {
        airplane.modeText = newText;
        airplane.airplaneOn = ((state == 2) || (state == 3));
        airplaneModeInProgress = ((state == 1) || (state == 2));

        if(inProgress) {
            wifi.close();
            vpn.close();
            bluetooth.close();
        }
    }

    function updateChangedFields() {
        if(rotation.delayUpdate) {
            rotation.delayUpdate   = false;
            rotation.modeText      = rotation.newText;
            rotation.locked        = rotation.newLockStatus;
        }

        if(muteControl.delayUpdate) {
            muteControl.delayUpdate   = false;
            muteControl.muteText      = muteControl.newText;
            muteControl.mute          = muteControl.newMuteStatus;
        }
    }

    function setSystemBrightness(newValue) {
        brightness.brightnessValue = Math.max(0.0, Math.min(newValue, 1.0));
    }

    // ------------------------------------------------------------


    BorderImage {
        source: "/usr/palm/sysmgr/images/menu-dropdown-bg.png"
        width: parent.width / (uiScale/4);
        height: Math.min(systemmenu.height / (uiScale/4),  (mainMenu.height + clipRect.anchors.topMargin + clipRect.anchors.bottomMargin) / (uiScale/4));
        transform: Scale { origin.x: 0; origin.y: 0; xScale: uiScale/4; yScale: uiScale/4;}
        border { left: 120; top: 40; right: 120; bottom: 120 }
    }

    Rectangle { // clipping rect inside the menu border
        id: clipRect
        anchors.fill: parent
        color: "transparent"
        clip: true
        anchors.leftMargin: 7 * uiScale
        anchors.topMargin: 0 * uiScale
        anchors.bottomMargin:14 * uiScale
        anchors.rightMargin: 7 * uiScale

        Flickable {
            id: flickableArea
            width: mainMenu.width;
            height: Math.min(systemmenu.height - clipRect.anchors.topMargin - clipRect.anchors.bottomMargin, mainMenu.height);
            contentWidth: mainMenu.width; contentHeight: mainMenu.height;
            interactive: !flickableOverride

            NumberAnimation on contentItem.y {
                id: viewAnimation;
                duration: 200;
                easing.type: Easing.InOutQuad
            }


            Column {
                id: mainMenu
                spacing: 0
                width: clipRect.width

                DateElement {
                    id: date
                    menuPosition: 1; // top
                    ident: headerIdent;
                    uiScale: systemmenu.uiScale;
                }

                MenuDivider {widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                BatteryElement {
                    id: battery
                    ident: headerIdent;
                    uiScale: systemmenu.uiScale;
                }

                MenuDivider {widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                BrightnessElement {
                    id: brightness
                    visible:    true
                    margin:      20 * uiScale;
                    uiScale: systemmenu.uiScale;

                    onBrightnessChanged: {
                        menuBrightnessChanged(value, save);
                    }

                    onFlickOverride: {
                        flickableOverride = override;
                    }
                }

                MenuDivider {widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                WiFiElement {
                    id: wifi
                    objectName: "wifiMenu"
                    visible: false
                    ident:         headerIdent;
                    internalIdent: subItemIdent;
                    active: !airplaneModeInProgress;
                    maxViewHeight : maxHeight - clipRect.anchors.topMargin - clipRect.anchors.bottomMargin;
                    uiScale: systemmenu.uiScale;

                    onMenuCloseRequest: {
                        closeMenuTimer.interval = delayMs;
                        closeMenuTimer.start();
                    }

                    onRequestViewAdjustment: {
                        // this is not working correctly in QML right now.
//                        viewAnimation.to = flickableArea.contentItem.y - offset;
//                        viewAnimation.start();
                    }
                }

                MenuDivider {visible: wifi.visible; widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                VpnElement {
                    id: vpn
                    objectName: "vpnMenu"
                    visible: false
                    ident:         headerIdent;
                    internalIdent: subItemIdent;
                    active: !airplaneModeInProgress;
                    maxViewHeight : maxHeight - clipRect.anchors.topMargin - clipRect.anchors.bottomMargin;
                    uiScale: systemmenu.uiScale;

                    onMenuCloseRequest: {
                        closeMenuTimer.interval = delayMs;
                        closeMenuTimer.start();
                    }

                    onRequestViewAdjustment: {
                        // this is not working correctly in QML right now.
//                        viewAnimation.to = flickableArea.contentItem.y - offset;
//                        viewAnimation.start();
                    }
                }

                MenuDivider {visible: vpn.visible; widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                BluetoothElement {
                    id: bluetooth
                    objectName: "bluetoothMenu"
                    visible: false
                    ident:         headerIdent;
                    internalIdent: subItemIdent;
                    active: !airplaneModeInProgress;
                    maxViewHeight : maxHeight - clipRect.anchors.topMargin - clipRect.anchors.bottomMargin;
                    uiScale: systemmenu.uiScale;

                    onMenuCloseRequest: {
                        closeMenuTimer.interval = delayMs;
                        closeMenuTimer.start();
                    }

                    onRequestViewAdjustment: {
                        // this is not working correctly in QML right now.
//                        viewAnimation.to = flickableArea.contentItem.y - offset;
//                        viewAnimation.start();
                    }
                }

                MenuDivider {visible: bluetooth.visible; widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                AirplaneModeElement {
                    id: airplane
                    visible:    true
                    ident:      headerIdent;
                    objectName: "airplaneMode"
                    selectable: !airplaneModeInProgress;
                    uiScale: systemmenu.uiScale;

                    onAction: {
                        airplaneModeTriggered()

                        closeMenuTimer.interval = 250;
                        closeMenuTimer.start();
                    }
                }

                MenuDivider {visible: airplane.visible; widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                RotationLockElement {
                    id: rotation
                    visible: true
                    ident:         headerIdent;
                    uiScale: systemmenu.uiScale;

                    onAction: {
                        rotation.delayUpdate = true;
                        rotationLockTriggered(rotation.locked)

                        closeMenuTimer.interval = 250;
                        closeMenuTimer.start();
                    }
                }

                MenuDivider {visible: rotation.visible; widthOffset: dividerWidthOffset; uiScale: systemmenu.uiScale; smooth: true;}

                MuteElement {
                    id: muteControl
                    visible: true
                    menuPosition: 2; // bottom
                    ident:         headerIdent;
                    uiScale: systemmenu.uiScale;

                    onAction: {
                        muteControl.delayUpdate = true;
                        muteToggleTriggered(muteControl.mute)

                        closeMenuTimer.interval = 250;
                        closeMenuTimer.start();
                    }
                }
            }

        }
    }

    Item {
        id: maskTop
        z:10
        width: (parent.width - (22 * uiScale)) / (uiScale/4)
        scale: uiScale/4
        anchors.horizontalCenter: parent.horizontalCenter
        y: 0
        opacity: !flickableArea.atYBeginning ? 1.0 : 0.0

        BorderImage {
            width: parent.width
            source: "/usr/palm/sysmgr/images/menu-dropdown-scrollfade-top.png"
            border { left: 80; top: 0; right: 80; bottom: 0 }
        }

        Image {
            anchors.horizontalCenter: parent.horizontalCenter
            y:0
            source: "/usr/palm/sysmgr/images/menu-arrow-up.png"
        }

        Behavior on opacity { NumberAnimation{ duration: 70} }
    }

    Item {
        id: maskBottom
        z:10
        width: (parent.width - (22 * uiScale)) / (uiScale/4)
        scale: uiScale/4
        anchors.horizontalCenter: parent.horizontalCenter
        y: flickableArea.height - (29 * uiScale)
        opacity: !flickableArea.atYEnd ? 1.0 : 0.0

        BorderImage {
            width: parent.width
            source: "/usr/palm/sysmgr/images/menu-dropdown-scrollfade-bottom.png"
            border { left: 80; top: 0; right: 80; bottom: 0 }
        }

        Image {
            anchors.horizontalCenter: parent.horizontalCenter
            y:10
            source: "/usr/palm/sysmgr/images/menu-arrow-down.png"
        }

        Behavior on opacity { NumberAnimation{ duration: 70} }
    }


    Timer{
        id      : closeMenuTimer
        repeat  : false;
        running : false;

        onTriggered: closeSystemMenu()
    }


    property bool resetWhenInvisible: false;

    onVisibleChanged: {
        if(resetWhenInvisible) {
            resetMenu();
            resetWhenInvisible = false;
        }

        if(!visible) {
            updateChangedFields();
        }
    }

    function flagMenuReset() {
        resetWhenInvisible = true;
    }

    function resetMenu () {
        wifi.close();
        bluetooth.close();
        vpn.close();
    }
}
