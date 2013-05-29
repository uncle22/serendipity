import Qt 4.7


MenuListEntry {
    id: brightnessElement

    property alias brightnessValue: brightnessSlider.setValue
    property bool active: true

    signal brightnessChanged(real value, bool save)

    selectable: false
    
    property real uiScale: 1.0

    property int margin: 0
    property int spacing: 5 * uiScale

    content:
        Item {
            id: brightnessContent
            x: 4
            width: brightnessElement.width - 8 * uiScale
            height: brightnessElement.height



            Image {
                id: imgLess
        	scale: uiScale/4
        	smooth: true
                source: "/usr/palm/sysmgr/images/statusBar/brightness-less.png"
                x: margin - (width / 2)
                y: brightnessElement.height/2 - height/2
            }

            Image {
                id: imgMore
        	scale: uiScale/4
        	smooth: true
                source: "/usr/palm/sysmgr/images/statusBar/brightness-more.png"
                x: brightnessContent.width - (width / 2) - margin
                y: brightnessElement.height/2 - height/2
            }

            Slider {
                id: brightnessSlider
                width: brightnessContent.width - ((imgLess.width / 2) + (imgMore.width / 2) + 2 * margin + 2 * spacing)
                x: brightnessContent.width/2 - width/2
                y: brightnessContent.height/2 - height/2
                active: brightnessElement.active
        	uiScale: brightnessElement.uiScale

                onValueChanged: {
                    brightnessChanged(value, done);
                }

                onSetFlickOverride: {
                    flickOverride(override)
                }
            }
        }
}
