import Qt 4.7

MenuListEntry {
    id: airplaneModeElement
    property int ident: 0
    property alias modeText:     airplaneMode.text
    property bool  airplaneOn:   false
    property real uiScale;

    property int iconSpacing : 16 * uiScale
    property int rightMarging: 12 * uiScale

    content:
        Item {
        width: airplaneModeElement.width

            Text {
            id: airplaneMode
                x: ident;
                anchors.verticalCenter: parent.verticalCenter
                text: runtime.getLocalizedString("Turn on Airplane Mode");
                color: selectable ? "#FFF" : "#AAA";
                font.bold: false;
                font.pixelSize: 18 * uiScale;
                font.family: "Prelude"
            }

            Image {
                id: airplaneIndicatorOn
                visible: !airplaneOn
                x: parent.width - (width/2) - iconSpacing - rightMarging
                anchors.verticalCenter: parent.verticalCenter
                opacity: selectable ? 1.0 : 0.65;
                scale: uiScale/4
                smooth: true

                source: "/usr/palm/sysmgr/images/statusBar/icon-airplane.png"
             }

            Image {
                id: airplaneIndicatorOff
                visible: airplaneOn
                x: parent.width - (width/2) - iconSpacing - rightMarging
                anchors.verticalCenter: parent.verticalCenter
                opacity: selectable ? 1.0 : 0.65;
                scale: uiScale/4
                smooth: true

                source: "/usr/palm/sysmgr/images/statusBar/icon-airplane-off.png"
             }
        }
}
