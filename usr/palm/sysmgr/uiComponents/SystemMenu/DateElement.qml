import Qt 4.7

MenuListEntry {
    property int ident: 0
    property real uiScale;

    function updateDate() {
        dateText.text = Qt.formatDate(new Date, Qt.DefaultLocaleLongDate);
    }

    selectable: false
    content:
        Text {
            id: dateText
            x: ident;
            text: Qt.formatDate(new Date, Qt.DefaultLocaleLongDate);
            color: "#AAA";
            font.bold: false;
            font.pixelSize: 18 * uiScale;
            font.family: "Prelude"
        }
}
