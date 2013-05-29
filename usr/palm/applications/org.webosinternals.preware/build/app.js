
// minifier: path aliases

enyo.path.addPaths({layout: "/home/jenkins/webos-ports/workspace/webos-ports/tmp-eglibc/work/all-webos-linux/org.webosinternals.preware/2.0.0+gitrAUTOINC+ce77b2c5e27029f4d96f3c543b79dddf08760e33-r0/git/enyo/../lib/layout/", onyx: "/home/jenkins/webos-ports/workspace/webos-ports/tmp-eglibc/work/all-webos-linux/org.webosinternals.preware/2.0.0+gitrAUTOINC+ce77b2c5e27029f4d96f3c543b79dddf08760e33-r0/git/enyo/../lib/onyx/", onyx: "/home/jenkins/webos-ports/workspace/webos-ports/tmp-eglibc/work/all-webos-linux/org.webosinternals.preware/2.0.0+gitrAUTOINC+ce77b2c5e27029f4d96f3c543b79dddf08760e33-r0/git/enyo/../lib/onyx/source/", model: "source/model/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: "",
rowOffset: 0
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
if (e < this.rowOffset || e >= this.count + this.rowOffset) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (enyo.dom.setInnerHtml(t, this.$.client.generateChildHtml()), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
if (e < 0 || e >= this.count) return;
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
if (e < 0 || e >= this.count) return;
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
reorderComponents: [],
pinnedReorderComponents: [],
swipeableComponents: [],
enableSwipe: !1,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onup: "up",
onholdpulse: "holdpulse"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0;"
} ]
} ],
reorderHoldTimeMS: 600,
draggingRowIndex: -1,
draggingRowNode: null,
placeholderRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
autoscrollPageY: 0,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPageNumber: -1,
completeReorderTimeout: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
percentageDraggedThreshold: .2,
importProps: function(e) {
e && e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged(), this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count);
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.isReordering()) return;
if (t.holdTime >= this.reorderHoldTimeMS && this.shouldStartReordering(e, t)) return t.preventDefault(), this.startReordering(t), !1;
},
dragstart: function(e, t) {
if (this.isReordering()) return !0;
if (this.isSwipeable()) return this.swipeDragStart(e, t);
},
drag: function(e, t) {
if (this.shouldDoReorderDrag(t)) return t.preventDefault(), this.reorderDrag(t), !0;
if (this.isSwipeable()) return t.preventDefault(), this.swipeDrag(e, t), !0;
},
dragfinish: function(e, t) {
this.isReordering() ? this.finishReordering(e, t) : this.isSwipeable() && this.swipeDragFinish(e, t);
},
up: function(e, t) {
this.isReordering() && this.finishReordering(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.rowsPerPage * this.page;
this.$.generator.setRowOffset(n);
var r = Math.min(this.count - n, this.rowsPerPage);
this.$.generator.setCount(r);
var i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
this.pageHeights[e] = s, this.portSize += s - o;
}
},
pageForRow: function(e) {
return Math.floor(e / this.rowsPerPage);
},
preserveDraggingRowNode: function(e) {
this.draggingRowNode && this.pageForRow(this.draggingRowIndex) === e && (this.$.holdingarea.hasNode().appendChild(this.draggingRowNode), this.draggingRowNode = null, this.removedInitialPage = !0);
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p0), this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.preserveDraggingRowNode(this.p1), this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && (this.$.generator.setRowOffset(0), this.$.generator.setCount(this.count), this.fixedHeight || (this.adjustBottomPage(), this.adjustPortSize()));
},
getPageRowHeights: function(e) {
var t = {}, n = e.hasNode().querySelectorAll("div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t[parseInt(i, 10)] = {
height: s.height,
width: s.width
});
return t;
},
updateRowBounds: function(e) {
this.p0RowBounds[e] ? this.updateRowBoundsAtIndex(e, this.p0RowBounds, this.$.page0) : this.p1RowBounds[e] && this.updateRowBoundsAtIndex(e, this.p1RowBounds, this.$.page1);
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = n.hasNode().querySelector('div[data-enyo-index="' + e + '"]'), i = enyo.dom.getBounds(r);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r,
startRow: t * this.rowsPerPage,
endRow: Math.min((t + 1) * this.rowsPerPage - 1, this.count - 1)
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
var t = this.pageHeights[e];
if (!t) {
var n = this.rowsPerPage * e, r = Math.min(this.count - n, this.rowsPerPage);
t = this.defaultPageHeight * (r / this.rowsPerPage);
}
return Math.max(1, t);
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.p0RowBounds = {}, this.p1RowBounds = {}, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments), r = this.getScrollTop();
return this.lastPos === r ? n : (this.lastPos = r, this.update(r), this.pinnedReorderMode && this.reorderScroll(e, t), n);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = this.pageForRow(e), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
pageForPageNumber: function(e, t) {
return e % 2 === 0 ? !t || e === this.p0 ? this.$.page0 : null : !t || e === this.p1 ? this.$.page1 : null;
},
shouldStartReordering: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
startReordering: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.draggingRowNode = e.target, this.removedInitialPage = !1, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = this.pageForRow(e.rowIndex), this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(enyo.bind(this, function() {
this.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), this.clearPositionReorderContainerTimeout();
}), 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function() {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e), this.updatePlaceholderPosition(e.pageY);
},
updatePlaceholderPosition: function(e) {
var t = this.getRowIndexFromCoordinate(e);
t !== -1 && (t >= this.placeholderRowIndex ? this.movePlaceholderToIndex(Math.min(this.count, t + 1)) : this.movePlaceholderToIndex(t));
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.getBounds(), n = t.left + e.ddx, r = t.top + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = enyo.dom.calcNodePosition(this.hasNode()), n = this.getBounds(), r;
this.autoscrollPageY = e.pageY, e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setInterval(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.updatePlaceholderPosition(this.autoscrollPageY);
},
movePlaceholderToIndex: function(e) {
var t, n;
if (e < 0) return;
e >= this.count ? (t = null, n = this.pageForPageNumber(this.pageForRow(this.count - 1)).hasNode()) : (t = this.$.generator.fetchRowNode(e), n = t.parentNode);
var r = this.pageForRow(e);
r >= this.pageCount && (r = this.currentPageNumber), n.insertBefore(this.placeholderNode, t), this.currentPageNumber !== r && (this.updatePageHeight(this.currentPageNumber), this.updatePageHeight(r), this.updatePagePositions(r)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (!this.isReordering() || this.pinnedReorderMode || this.completeReorderTimeout) return;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, t), 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
this.completeReorderTimeout = null, this.placeholderRowIndex > this.draggingRowIndex && (this.placeholderRowIndex = Math.max(0, this.placeholderRowIndex - 1));
if (this.draggingRowIndex == this.placeholderRowIndex && this.pinnedReorderComponents.length && !this.pinnedReorderMode && !this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.removeDraggingRowNode(), this.removePlaceholderNode(), this.emptyAndHideReorderContainer(), this.pinnedReorderMode = !1, this.reorderRows(e), this.draggingRowIndex = this.placeholderRowIndex = -1, this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.positionReorderedNode(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
positionReorderedNode: function() {
if (!this.removedInitialPage) {
var e = this.$.generator.fetchRowNode(this.placeholderRowIndex);
e && (e.parentNode.insertBefore(this.hiddenNode, e), this.showNode(this.hiddenNode)), this.hiddenNode = null;
if (this.currentPageNumber != this.initialPageNumber) {
var t, n, r = this.pageForPageNumber(this.currentPageNumber), i = this.pageForPageNumber(this.currentPageNumber + 1);
this.initialPageNumber < this.currentPageNumber ? (t = r.hasNode().firstChild, i.hasNode().appendChild(t)) : (t = r.hasNode().lastChild, n = i.hasNode().firstChild, i.hasNode().insertBefore(t, n)), this.correctPageHeights(), this.updatePagePositions(this.initialPageNumber);
}
}
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh(), this.correctPageHeights();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = this.hasNode().querySelector('[data-enyo-index="reordered"]'), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r && r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) continue;
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) return;
var n = this.getRelativeOffset(t, this.hasNode()), r = enyo.dom.getBounds(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t);
var n = this.pageForPageNumber(this.currentPageNumber);
n.hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = enyo.dom.getBounds(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeDraggingRowNode: function() {
this.draggingRowNode = null;
var e = this.$.holdingarea.hasNode();
e.innerHTML = "";
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e) {
if (e < 0) return;
var t = this.pageForPageNumber(e, !0);
if (t) {
var n = this.pageHeights[e], r = Math.max(1, t.getBounds().height);
this.pageHeights[e] = r, this.portSize += r - n;
}
},
updatePagePositions: function(e) {
this.positionPage(this.currentPageNumber, this.pageForPageNumber(this.currentPageNumber)), this.positionPage(e, this.pageForPageNumber(e));
},
correctPageHeights: function() {
this.updatePageHeight(this.currentPageNumber), this.initialPageNumber != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
this.moveReorderedContainerToDroppedPosition(e), this.completeReorderTimeout = setTimeout(enyo.bind(this, this.completeFinishReordering, e), 100);
return;
},
cancelPinnedMode: function(e) {
this.placeholderRowIndex = this.draggingRowIndex, this.dropPinnedRow(e);
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - enyo.dom.calcNodePosition(this.hasNode()).top;
if (t < 0) return -1;
var n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return this.count;
var i = n.pos, s = this.placeholderNode ? enyo.dom.getBounds(this.placeholderNode).height : 0, o = 0;
for (var u = n.startRow; u <= n.endRow; ++u) {
if (u === this.placeholderRowIndex) {
o += s;
if (o >= i) return -1;
}
if (u !== this.draggingRowIndex) {
o += r[u].height;
if (o >= i) return u;
}
}
return u;
},
getIndexPosition: function(e) {
return enyo.dom.calcNodePosition(this.$.generator.fetchRowNode(e));
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;"), this.updatePlaceholderPosition(this.initialPinPosition);
},
hideReorderingRow: function() {
var e = this.hasNode().querySelector('[data-enyo-index="' + this.draggingRowIndex + '"]');
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
isSwiping: function() {
return this.swipeIndex != null && !this.swipeComplete && this.swipeDirection != null;
},
swipeDragStart: function(e, t) {
return t.index == null || t.vertical ? !0 : (this.completeSwipeTimeout && this.completeSwipe(t), this.swipeComplete = !1, this.swipeIndex != t.index && (this.clearSwipeables(), this.swipeIndex = t.index), this.swipeDirection = t.xDirection, this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
swipeDrag: function(e, t) {
return this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : this.isSwiping() ? (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, !0) : !1;
},
swipeDragFinish: function(e, t) {
if (this.persistentItemVisible) this.dragFinishPersistentItem(t); else {
if (!this.isSwiping()) return !1;
var n = this.calcPercentageDragged(this.draggedXDistance);
n > this.percentageDraggedThreshold && t.xDirection === this.swipeDirection ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t);
}
return this.preventDragPropagation;
},
isSwipeable: function() {
return this.enableSwipe && this.$.swipeableComponents.controls.length !== 0 && !this.isReordering() && !this.pinnedReorderMode;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = enyo.dom.getBounds(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
calcNewDragPosition: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = t.left, r = this.$.swipeableComponents.getBounds(), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / this.$.swipeableComponents.getBounds().width);
},
swipe: function(e) {
this.swipeComplete = !0, this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.$.swipeableComponents.getBounds(), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.swipeDirection = null;
},
bounceItem: function(e) {
var t = this.$.swipeableComponents.getBounds();
t.left != t.width && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = e.getBounds().width, n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.swipeIndex = null, this.swipeDirection = null;
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "holdingarea",
allowHtml: !0,
classes: "enyo-list-holdingarea"
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
}
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
noSelect: !0,
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e != null && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e));
var t;
this.selected != null && (this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected"), t = this.$.flyweight.fetchRowNode(this.selected)), this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), enyo.platform.firefoxOS && (this.moreComponents[2].ondown = "down", this.moreComponents[2].onleave = "leave"), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// PortsHeader.js

enyo.kind({
name: "PortsHeader",
kind: "onyx.Toolbar",
classes: "ports-header",
title: "WebOS Ports Header",
taglines: [ "Random Tagline Here." ],
components: [ {
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
tag: "div",
style: "height: 100%; margin: 0 0 0 8px;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.Title.setContent(this.title), this.$.Tagline.setContent(this.taglines[Math.floor(Math.random() * this.taglines.length)]);
}
});

// PortsSearch.js

enyo.kind({
name: "PortsSearch",
kind: "PortsHeader",
title: "WebOS Ports Search",
instant: !1,
submitCloses: !0,
taglines: [ "Shiny search button, PRESS IT!" ],
events: {
onSearch: ""
},
components: [ {
name: "SearchAnimator",
kind: "Animator",
onStep: "animatorStep",
onStop: "animatorStop",
value: 0,
endValue: 0
}, {
name: "Icon",
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
name: "TextDiv",
tag: "div",
style: "height: 100%; margin: 0;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
}, {
name: "SearchDecorator",
kind: "onyx.InputDecorator",
style: "position: absolute; top: 10px; right: 8px; width: 32px; height: 32px; padding: 0; max-width: 100%; border-radius: 16px;",
components: [ {
name: "SearchInput",
id: "searchBox",
kind: "onyx.Input",
style: "width: 0; height: 30px; margin-left: 8px;",
oninput: "inputChanged",
onchange: "searchSubmitted"
} ]
}, {
kind: "onyx.Button",
src: "$lib/webos-ports-lib/assets/search-input-search.png",
style: "position: absolute; width: 30px; height: 30px; right: 6px; top: 12px; padding: 0; border-radius: 24px;",
ontap: "toggleSearch",
components: [ {
kind: "Image",
src: "$lib/webos-ports-lib/assets/search-input-search.png",
style: "margin-top: -1px; padding: 0;"
} ]
} ],
toggleSearch: function(e, t) {
this.$.SearchAnimator.setStartValue(this.$.SearchAnimator.value), this.$.SearchAnimator.setEndValue(this.$.SearchAnimator.endValue == 0 ? 1 : 0), this.$.SearchAnimator.play();
},
animatorStep: function(e, t) {
this.$.SearchInput.applyStyle("width", this.hasNode().offsetWidth * e.value - 52 + "px"), this.$.SearchDecorator.applyStyle("width", this.$.SearchInput.hasNode().offsetWidth + 32 + "px"), enyo.Arranger.opacifyControl(this.$.Icon, 1 - e.value), enyo.Arranger.opacifyControl(this.$.TextDiv, 1 - e.value), this.$.SearchAnimator.endValue == 1 && this.$.SearchInput.hasNode().focus();
},
animatorStop: function(e, t) {},
inputChanged: function(e, t) {
this.instant && this.doSearch({
value: this.$.SearchInput.getValue()
});
},
searchSubmitted: function(e, t) {
this.instant || this.doSearch({
value: this.$.SearchInput.getValue()
}), this.submitCloses && (this.toggleSearch(), this.$.SearchInput.hasNode().blur());
},
searchActive: function() {
return this.$.SearchInput.getValue() != "";
}
});

// BackGesture.js

(function() {
document.addEventListener("keyup", function(e) {
(e.keyIdentifier == "U+1200001" || e.keyIdentifier == "U+001B") && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onbackbutton");
}, !1);
})();

// CoreNavi.js

enyo.kind({
name: "CoreNavi",
style: "background-color: black;",
layoutKind: "FittableColumnsLayout",
fingerTracking: !1,
components: [ {
style: "width: 33%;"
}, {
kind: "Image",
src: "$lib/webos-ports-lib/assets/lightbar.png",
fit: !0,
style: "width: 33%; height: 24px; padding-top: 2px;",
ondragstart: "handleDragStart",
ondrag: "handleDrag",
ondragfinish: "handleDragFinish"
}, {
style: "width: 33%;"
} ],
create: function() {
this.inherited(arguments), window.PalmSystem && this.addStyles("display: none;");
},
handleDragStart: function(e, t) {
this.fingerTracking == 0 ? t.xDirection == -1 && (evB = document.createEvent("HTMLEvents"), evB.initEvent("keyup", "true", "true"), evB.keyIdentifier = "U+1200001", document.dispatchEvent(evB)) : enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragStart", t);
},
handleDrag: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDrag", t);
},
handleDragFinish: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragFinish", t);
}
});

// CoreNaviArranger.js

enyo.kind({
name: "enyo.CoreNaviArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width * .5;
},
destroy: function() {
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) this.pushPopControl(n, 0, 1), n.setShowing(!0), n.resized();
this.inherited(arguments);
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) {
s = n == 0 ? 1 : 0;
switch (n) {
case 0:
i = 1;
break;
case 1:
i = .66;
break;
case e.length - 1:
i = 1.33;
}
this.arrangeControl(r, {
scale: i,
opacity: s
});
}
},
start: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && n.resized();
this.vendor || (this.vendor = this.getVendor());
},
finish: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.scale, r = t.opacity;
n != null && r != null && this.pushPopControl(e, n, r);
},
pushPopControl: function(e, t, n) {
var r = t, i = n;
enyo.dom.canAccelerate ? e.applyStyle(this.vendor + "transform", "scale3d(" + r + "," + r + ",1)") : e.applyStyle(this.vendor + "transform", "scale(" + r + "," + r + ")"), enyo.Arranger.opacifyControl(e, n);
},
getVendor: function() {
var e = "", t = [ "transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform" ], n = document.createElement("div");
for (i = 0; i < t.length; i++) {
if (typeof n.style[t[i]] != "undefined") {
e = t[i];
break;
}
e = null;
}
switch (e) {
case "transform":
e = "";
break;
case "WebkitTransform":
e = "-webkit-";
break;
case "MozTransform":
e = "-moz-";
break;
case "OTransform":
e = "-o-";
break;
case "msTransform":
e = "-ms-";
}
return e;
}
});

// ProgressOrb.js

enyo.kind({
name: "Pie",
published: {
angle: 0
},
style: "width: 90%; height: 90%;",
components: [ {
name: "PieBackground",
tag: "div",
classes: "pie pie-background"
}, {
name: "LeftMask",
classes: "pie",
components: [ {
name: "PieLeftHalf",
classes: "pie pie-foreground"
} ]
}, {
name: "RightMask",
classes: "pie",
components: [ {
name: "PieRightHalf",
classes: "pie pie-foreground"
} ]
} ],
rendered: function() {
this.setupClipping(), this.applyRotation();
},
angleChanged: function() {
this.applyRotation();
},
setupClipping: function() {
var e = this.hasNode().clientWidth;
this.$.LeftMask.addStyles("clip: rect(0, " + e / 2 + "px, " + e + "px, 0);"), this.$.PieLeftHalf.addStyles("clip: rect(0," + e / 2 + "px" + "," + e + "px" + ",0);"), this.$.RightMask.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");"), this.$.PieRightHalf.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");");
},
applyRotation: function() {
this.$.PieRightHalf.addStyles("-webkit-transform: rotateZ(" + Math.min(this.angle - 180, 0) + "deg);"), this.$.PieLeftHalf.addStyles("-webkit-transform: rotateZ(" + Math.max(this.angle, 180) + "deg);");
}
}), enyo.kind({
name: "ProgressOrb",
fit: !0,
published: {
value: 0,
min: 0,
max: 1e3
},
style: "position: absolute; width: 48px; height: 48px;",
events: {
onButtonTap: ""
},
components: [ {
name: "ProgressAnimator",
kind: "Animator",
duration: 500,
onStep: "animatorStep"
}, {
name: "OuterRing",
style: "width: 90%; height: 90%; padding: 5%; background-color: #000; border-radius: 50%;",
components: [ {
name: "Pie",
kind: "Pie",
style: "position: absolute;"
}, {
name: "CenterButton",
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "position: absolute; width:65%; height: 65%; margin: 12.5%; padding: 0; border-radius: 50%;",
ontap: "buttonTapped"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.CenterButton.applyStyle("font-size", this.$.CenterButton.hasNode().clientHeight / 2 + "px"), this.$.CenterButton.setContent(this.content);
},
buttonTapped: function() {
this.doButtonTap();
},
valueChanged: function() {
var e = this.$.ProgressAnimator.value;
this.$.ProgressAnimator.setStartValue(e != undefined ? e : 0), this.$.ProgressAnimator.setEndValue(this.value), this.$.ProgressAnimator.play();
},
animatorStep: function(e) {
var t = 0, n = 1, r = this.max, i = this.min, s = r - i, o = n - t, u = o * (e.value - i) / s + t, u = Math.max(Math.min(u, n), t), a = 360 * u;
this.$.Pie.setAngle(a);
}
});

// NumberPad.js

enyo.kind({
name: "NumberPad",
layoutKind: "FittableRowsLayout",
events: {
onKeyTapped: ""
},
defaultKind: enyo.kind({
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "width: 33.3%; height: 25%; font-size: 32pt; font-weight: bold;",
ontap: "keyTapped"
}),
components: [ {
content: "1",
style: "border-radius: 16px 0 0 0;"
}, {
content: "2",
style: "border-radius: 0;"
}, {
content: "3",
style: "border-radius: 0 16px 0 0;"
}, {
content: "4",
style: "border-radius: 0;"
}, {
content: "5",
style: "border-radius: 0;"
}, {
content: "6",
style: "border-radius: 0;"
}, {
content: "7",
style: "border-radius: 0;"
}, {
content: "8",
style: "border-radius: 0;"
}, {
content: "9",
style: "border-radius: 0;"
}, {
content: "*",
style: "border-radius: 0 0 0 16px;"
}, {
content: "0",
style: "border-radius: 0;"
}, {
content: "#",
style: "border-radius: 0 0 16px 0;"
} ],
keyTapped: function(e) {
this.doKeyTapped({
value: e.content
});
}
});

// App.js

enyo.kind({
name: "Toast",
kind: "enyo.Slideable",
style: "position: absolute;		bottom: 54px;		width: 90%;		margin-left: -45%;		left: 50%;		height: 33%;		color: black;		background-color: lightgrey;		border: 1px grey;		border-radius: 16px 16px 0 0;		text-align: center;",
classes: "onyx-toolbar",
min: 0,
max: 100,
value: 100,
unit: "%",
axis: "v",
draggable: !1
}), enyo.kind({
name: "GrabberToolbar",
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Grabber"
} ],
reflow: function() {
this.children[0].applyStyle("visibility", enyo.Panels.isScreenNarrow() ? "hidden" : "visible");
}
}), enyo.kind({
name: "EmptyPanel",
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar"
}, {
fit: !0,
style: "background-image: url('assets/bg.png')"
}, {
kind: "onyx.Toolbar"
} ]
}), enyo.kind({
name: "ListItem",
classes: "list-item",
ontap: "menuItemTapped",
content: "List Item",
icon: !1,
handlers: {
onmousedown: "pressed",
ondragstart: "released",
onmouseup: "released"
},
components: [ {
name: "ItemIcon",
kind: "Image",
style: "display: none; height: 100%; margin-right: 8px;"
}, {
name: "ItemTitle",
style: "display: inline-block; position: absolute; margin-top: 6px;"
} ],
create: function() {
this.inherited(arguments), this.$.ItemTitle.setContent(this.content);
},
rendered: function() {
this.icon && this.$.ItemIcon.addStyles("display: inline-block;");
},
pressed: function() {
this.addClass("onyx-selected");
},
released: function() {
this.removeClass("onyx-selected");
}
}), enyo.kind({
name: "AppPanels",
kind: "Panels",
fit: !0,
arrangerKind: "CollapsingArranger",
classes: "app-panels",
ipkgServiceVersion: 14,
currentType: "",
availableCategories: [],
currentCategory: "",
availablePackages: [],
currentPackage: {},
components: [ {
kind: "Signals",
onPackagesStatusUpdate: "processStatusUpdate",
onPackagesLoadFinished: "doneLoading",
onPackageSimpleMessage: "processSimpleMessage",
onPackageProgressMessage: "processProgressMessage",
onPackageRefresh: "handlePackageRefresh",
ondeviceready: "handleDeviceReady"
}, {
name: "MenuPanel",
layoutKind: "FittableRowsLayout",
style: "width: 33.3%",
components: [ {
kind: "PortsSearch",
title: "Preware",
taglines: [ "I live... again...", "Miss me?", "Installing packages, with a penguin!", "How many Ports could a webOS Ports Port?", "Not just for Apps anymore.", "Now with 100% more Enyo2!" ]
}, {
name: "ScrollerPanel",
kind: "Panels",
arrangerKind: "CardArranger",
fit: !0,
draggable: !1,
components: [ {
style: "width: 100%; height: 100%; background-image: url('assets/bg.png');",
components: [ {
kind: "FittableRows",
classes: "onyx-toolbar",
style: "width: 90%; height: 224px; margin: 10% 2.5% 2.5% 2.5%; text-align: center; border-radius: 16px;",
components: [ {
kind: "onyx.Spinner"
}, {
name: "SpinnerText",
style: "color: white;",
allowHtml: !0
} ]
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
classes: "enyo-fill",
style: "background-image:url('assets/bg.png')",
touch: !0,
ontap: "showTypeList",
components: [ {
kind: "ListItem",
content: "Package Updates"
}, {
kind: "ListItem",
content: "Available Packages"
}, {
kind: "ListItem",
content: "Installed Packages"
}, {
kind: "ListItem",
content: "List of Everything"
} ]
} ]
}, {
kind: "onyx.Toolbar"
} ]
}, {
name: "TypePanels",
kind: "Panels",
arrangerKind: "CardArranger",
draggable: !1,
style: "width: 33.3%;",
components: [ {
kind: "EmptyPanel"
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
style: "display: inline-block; position: absolute;",
content: "Types"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
classes: "enyo-fill",
style: "background-image:url('assets/bg.png')",
touch: !0,
fit: !0,
components: [ {
name: "TypeRepeater",
kind: "Repeater",
onSetupItem: "setupTypeItem",
count: 0,
components: [ {
kind: "ListItem",
content: "Type",
ontap: "typeTapped"
} ]
} ]
}, {
kind: "GrabberToolbar"
} ]
} ]
}, {
name: "CategoryPanels",
kind: "Panels",
arrangerKind: "CardArranger",
draggable: !1,
style: "width: 33.3%;",
components: [ {
kind: "EmptyPanel"
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
style: "display: inline-block; position: absolute;",
content: "Categories"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
classes: "enyo-fill",
style: "background-image:url('assets/bg.png')",
touch: !0,
fit: !0,
components: [ {
name: "CategoryRepeater",
kind: "Repeater",
onSetupItem: "setupCategoryItem",
count: 0,
components: [ {
kind: "ListItem",
content: "Category",
ontap: "categoryTapped"
} ]
} ]
}, {
kind: "GrabberToolbar"
} ]
} ]
}, {
name: "PackagePanels",
kind: "Panels",
arrangerKind: "CardArranger",
draggable: !1,
style: "width: 33.3%;",
components: [ {
kind: "EmptyPanel"
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
style: "display: inline-block; position: absolute;",
content: "Packages"
} ]
}, {
kind: "Scroller",
horizontal: "hidden",
classes: "enyo-fill",
style: "background-image:url('assets/bg.png')",
touch: !0,
fit: !0,
ontap: "showPackage",
components: [ {
name: "PackageRepeater",
kind: "Repeater",
onSetupItem: "setupPackageItem",
count: 0,
components: [ {
kind: "ListItem",
content: "Package",
icon: !0,
ontap: "packageTapped"
} ]
} ]
}, {
kind: "GrabberToolbar"
} ]
} ]
}, {
name: "PackageDisplayPanels",
kind: "Panels",
arrangerKind: "CardArranger",
draggable: !1,
style: "width: 33.3%;",
components: [ {
kind: "EmptyPanel"
}, {
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
name: "PackageIcon",
kind: "Image",
style: "height: 100%; margin-right: 8px;"
}, {
name: "PackageTitle",
style: "display: inline-block; position: absolute;",
content: "Package"
} ]
}, {
kind: "Scroller",
style: "position: absolute; top: 54px; bottom: 54px;",
horizontal: "hidden",
touch: !0,
ontap: "showPackage",
components: [ {
style: "padding: 15px;",
components: [ {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Description"
}, {
name: "PackageDescription",
style: "padding: 15px; color: white;",
allowHtml: !0
}, {
kind: "onyx.GroupboxHeader",
content: "Homepage"
}, {
name: "PackageHomepage",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Maintainter"
}, {
name: "PackageMaintainer",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Version"
}, {
name: "PackageVersion",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Last Updated"
}, {
name: "PackageLastUpdated",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Download Size"
}, {
name: "PackageDownloadSize",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Installed Version"
}, {
name: "PackageInstalledVersion",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Installed"
}, {
name: "PackageInstalledDate",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Installed Size"
}, {
name: "PackageInstalledSize",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "ID"
}, {
name: "PackageID",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "License"
}, {
name: "PackageLicense",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Type"
}, {
name: "PackageType",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Category"
}, {
name: "PackageCategory",
style: "padding: 15px; color: white;"
}, {
kind: "onyx.GroupboxHeader",
content: "Feed"
}, {
name: "PackageFeed",
style: "padding: 15px; color: white;"
} ]
} ]
} ]
}, {
name: "SimpleMessage",
kind: "Toast",
style: "height: 90px;",
components: [ {
name: "SimpleMessageContent",
style: "display: block; font-size: 14pt; height: 32px;",
allowHtml: !0,
content: "Message<br>I am a fish."
}, {
kind: "onyx.Button",
style: "display: block; width: 100%; margin-top: 4px;",
content: "Okay",
ontap: "hideSimpleMessage"
} ]
}, {
name: "ActionMessage",
kind: "Toast",
components: [ {
name: "ActionMessageContent",
style: "display: block; font-size: 14pt; height: 46px;",
allowHtml: !0,
content: "Message<br>I am a fish."
}, {
kind: "onyx.Button",
style: "display: block; width: 100%; margin-top: 10px;",
content: "Button 1",
ontap: "hideActionMessage"
}, {
kind: "onyx.Button",
style: "display: block; width: 100%; margin-top: 10px;",
content: "Button 2",
ontap: "hideActionMessage"
} ]
}, {
name: "ProgressMessage",
kind: "Toast",
style: "height: 256px;",
components: [ {
name: "ProgressMessageContent",
style: "display: block; font-size: 14pt; height: 132px; margin-top: 8px;",
allowHtml: !0,
content: "Message<br>I am a fish."
}, {
kind: "onyx.Spinner",
classes: "onyx-light"
} ]
}, {
kind: "GrabberToolbar",
style: "position: absolute; bottom: 0; width: 100%;",
components: [ {
name: "InstallButton",
kind: "onyx.Button",
content: "Install",
ontap: "installTapped"
}, {
name: "UpdateButton",
kind: "onyx.Button",
content: "Update",
ontap: "updateTapped"
}, {
name: "RemoveButton",
kind: "onyx.Button",
content: "Remove",
ontap: "removeTapped"
}, {
name: "LaunchButton",
kind: "onyx.Button",
content: "Launch",
ontap: "launchTapped"
} ]
} ]
} ]
} ],
create: function(e, t) {
this.inherited(arguments), window.PalmServiceBridge == undefined ? (this.log("No PalmServiceBridge found."), this.$.ScrollerPanel.setIndex(1)) : this.log("PalmServiceBridge found.");
},
handleDeviceReady: function(e, t) {
this.log("device.version: " + device && device.version), this.log("device.name: " + device && device.name), this.startLoadFeeds();
},
reflow: function(e) {
this.inherited(arguments), enyo.Panels.isScreenNarrow() ? (this.setArrangerKind("CoreNaviArranger"), this.setDraggable(!1), this.$.CategoryPanels.addStyles("box-shadow: 0"), this.$.SubcategoryPanels.addStyles("box-shadow: 0"), this.$.PackagePanels.addStyles("box-shadow: 0"), this.$.PackageDisplayPanels.addStyles("box-shadow: 0")) : (this.setArrangerKind("CollapsingArranger"), this.setDraggable(!0), this.$.TypePanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)"), this.$.CategoryPanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)"), this.$.PackagePanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)"), this.$.PackageDisplayPanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)"));
},
displaySimpleMessage: function(e) {
this.hideProgressMessage(), this.hideActionMessage(), this.$.SimpleMessageContent.setContent(e), this.$.SimpleMessage.value != this.$.SimpleMessage.min && this.$.SimpleMessage.animateToMin();
},
hideSimpleMessage: function() {
this.$.SimpleMessage.animateToMax();
},
displayProgressMessage: function(e) {
this.hideSimpleMessage(), this.hideActionMessage(), this.$.ProgressMessageContent.setContent(e.message), this.$.ProgressMessage.value != this.$.ProgressMessage.min && this.$.ProgressMessage.animateToMin();
},
hideProgressMessage: function() {
this.$.ProgressMessage.animateToMax();
},
displayActionMessage: function(e) {
this.hideSimpleMessage(), this.hideProgressMessage(), this.$.ActionMessageContent.setContent(e.message), this.$.ActionMessage.value != this.$.ActionMessage.min && this.$.ActionMessage.animateToMin();
},
hideActionMessage: function() {
this.$.ActionMessage.animateToMax();
},
log: function(e) {
console.error(e), this.$.SpinnerText.setContent(e);
},
showTypeList: function() {
this.$.TypePanels.setIndex(1), this.setIndex(1);
},
typeTapped: function(e) {
this.currentType = e.$.ItemTitle.content, this.availableCategories = [];
for (var t = 0; t < preware.PackagesModel.packages.length; t++) {
var n = preware.PackagesModel.packages[t];
n.type == e.$.ItemTitle.content && this.availableCategories.indexOf(n.category) == -1 && this.availableCategories.push(n.category);
}
this.$.CategoryRepeater.setCount(this.availableCategories.length), this.$.CategoryPanels.setIndex(1), this.setIndex(2);
},
categoryTapped: function(e) {
this.currentCategory = e.$.ItemTitle.content, this.availablePackages = [];
for (var t = 0; t < preware.PackagesModel.packages.length; t++) {
var n = preware.PackagesModel.packages[t];
n.type == this.currentType && n.category == this.currentCategory && this.availablePackages.indexOf(n) == -1 && this.availablePackages.push(n);
}
this.$.PackageRepeater.setCount(this.availablePackages.length), this.$.PackagePanels.setIndex(1), this.setIndex(3);
},
packageTapped: function(e) {
this.updateCurrentPackage(e.$.ItemTitle.content), this.refreshPackageDisplay(), this.$.PackageDisplayPanels.setIndex(1), this.setIndex(4);
},
launchTapped: function() {
this.currentPackage.launch();
},
installTapped: function() {
this.currentPackage.doInstall(!0);
},
updateTapped: function() {
this.currentPackage.doUpdate(!0);
},
removeTapped: function() {
this.currentPackage.doRemove(!0);
},
versionTap: function(e, t) {
preware.IPKGService.version(this.gotVersion.bind(this)), this.log("Getting Version");
},
gotVersion: function(e) {
this.log("Version: " + JSON.stringify(e) + "<br>");
},
machineName: function() {
preware.IPKGService.getMachineName(this.gotMachineName.bind(this)), this.log("Requesting Machine Name");
},
gotMachineName: function(e) {
this.log("Got Machine Name: " + e + " (" + JSON.stringify(e) + ")");
},
startLoadFeeds: function() {
this.log("Start Loading Feeds"), preware.DeviceProfile.getDeviceProfile(this.gotDeviceProfile.bind(this), !1);
},
gotDeviceProfile: function(e, t) {
this.log("Got Device Profile: " + (t ? t.success : "")), !t.success || !t.deviceProfile ? (this.log("Failed to get device profile."), preware.IPKGService.getMachineName(this.onDeviceType.bind(this)), this.log("Requesting Machine Name.")) : (this.log("Got deviceProfile: " + JSON.stringify(t.deviceProfile)), this.deviceProfile = t.deviceProfile, preware.PalmProfile.getPalmProfile(this.gotPalmProfile.bind(this), !1));
},
gotPalmProfile: function(e, t) {
!t.success || !t.palmProfile ? (this.log("failed to get palm profile"), preware.IPKGService.getMachineName(this.onDeviceType.bind(this)), this.log("Requesting Machine Name")) : (this.log("Got palmProfile."), this.palmProfile = t.palmProfile, preware.IPKGService.setAuthParams(this.authParamsSet.bind(this), this.deviceProfile.deviceId, this.palmProfile.token));
},
authParamsSet: function(e) {
this.log("Got authParams: " + JSON.stringify(e)), preware.IPKGService.getMachineName(this.onDeviceType.bind(this)), this.log("Requesting Machine Name");
},
onDeviceType: function(e) {
this.log("Requesting Connection Status"), navigator.service.Request("palm://com.palm.connectionmanager", {
method: "getstatus",
onSuccess: this.onConnection.bind(this),
onFailure: this.onConnectionFailure.bind(this)
});
},
onConnectionFailure: function(e) {
console.log("Failure, response=" + JSON.stringify(e));
},
onConnection: function(e) {
var t = !1;
e && e.returnValue === !0 && (e.isInternetConnectionAvailable === !0 || e.wifi.state === "connected") && (t = !0), this.log("Got Connection Status. Connection: " + t), this.log("Run Version Check"), preware.IPKGService.version(this.onVersionCheck.bind(this, t));
},
onVersionCheck: function(e, t) {
this.log("Version Check Returned: " + JSON.stringify(t));
try {
preware.IPKGService.logPayload(t, "VersionCheck"), t ? t.errorCode !== undefined ? t.errorText === "org.webosinternals.ipkgservice is not running." ? this.log($L("The service is not running. First try restarting Preware, or reboot your device and try again.")) : this.log(t.errorText) : t.apiVersion && t.apiVersion < this.ipkgServiceVersion ? this.log($L("The service version is too old. First try rebooting your device, or reinstall Preware and try again.")) : e && !this.onlyLoad ? (this.log("start to download feeds"), preware.FeedsModel.loadFeeds(this.downLoadFeeds.bind(this)), this.log("...")) : this.loadFeeds() : this.log($L("Cannot access the service. First try restarting Preware, or reboot your device and try again."));
} catch (n) {
enyo.error("feedsModel#loadFeeds", n), this.log("Exception Caught: " + n);
}
},
downLoadFeeds: function(e, t) {
this.log("loaded feeds: " + JSON.stringify(t)), this.feeds = t, this.feeds.length && this.downloadFeedRequest(0);
},
downloadFeedRequest: function(e) {
this.processStatusUpdate(this, {
message: $L("<strong>Downloading Feed Information</strong><br>") + this.feeds[e].name
}), preware.IPKGService.downloadFeed(this.downloadFeedResponse.bind(this, e), this.feeds[e].gzipped, this.feeds[e].name, this.feeds[e].url);
},
downloadFeedResponse: function(e, t) {
!t.returnValue || t.stage === "failed" ? this.log(t.errorText + "<br>" + t.stdErr.join("<br>")) : t.stage === "status" ? this.processStatusUpdate(this, {
message: $L("<strong>Downloading Feed Information</strong><br>") + this.feeds[e].name + "<br><br>" + t.status
}) : t.stage === "completed" && (e += 1, e < this.feeds.length ? this.downloadFeedRequest(e) : (this.processStatusUpdate(this, {
message: $L("<strong>Done Downloading!</strong>")
}), preware.PrefCookie.put("lastUpdate", Math.round((new Date).getTime() / 1e3)), this.loadFeeds()));
},
loadFeeds: function() {
this.processStatusUpdate(this, {
message: $L("<strong>Loading Package Information</strong><br>")
}), preware.FeedsModel.loadFeeds(this.parseFeeds.bind(this));
},
parseFeeds: function(e, t) {
preware.PackagesModel.loadFeeds(t, this.onlyLoad);
},
processStatusUpdate: function(e, t) {
this.log(t.message);
},
processSimpleMessage: function(e, t) {
this.displaySimpleMessage(t);
},
processProgressMessage: function(e, t) {
this.displayProgressMessage(t);
},
doneLoading: function() {
this.processStatusUpdate(this, {
message: $L("<strong>Done!</strong>")
});
if (!this.isActive || !this.isVisible) this.onlyLoad ? navigator.notification.showBanner($L("Preware: Done Loading Feeds"), {
source: "updateNotification"
}, "miniicon.png") : navigator.notification.showBanner($L("Preware: Done Updating Feeds"), {
source: "updateNotification"
}, "miniicon.png");
var e = this;
setTimeout(function() {
e.$.ScrollerPanel.setIndex(1);
}, 500), this.$.TypeRepeater.setCount(preware.PackagesModel.types.length), this.$.CategoryRepeater.setCount(preware.PackagesModel.categories.length), this.$.PackageRepeater.setCount(preware.PackagesModel.packages.length);
},
handlePackageRefresh: function() {
this.updateCurrentPackage(this.currentPackage.title), this.refreshPackageDisplay();
},
updateCurrentPackage: function(e) {
for (var t = 0; t < preware.PackagesModel.packages.length; t++) {
var n = preware.PackagesModel.packages[t];
if (n.title == e) {
this.currentPackage = n;
break;
}
}
},
refreshPackageDisplay: function() {
this.$.PackageTitle.setContent(this.currentPackage.title), this.$.PackageIcon.setSrc(this.currentPackage.icon), this.$.PackageDescription.setContent(this.currentPackage.description), this.$.PackageHomepage.setContent(this.currentPackage.homepage), this.$.PackageMaintainer.setContent(this.currentPackage.maintainer), this.$.PackageVersion.setContent(this.currentPackage.version), this.$.PackageLastUpdated.setContent(this.currentPackage.date), this.$.PackageDownloadSize.setContent(this.currentPackage.size), this.$.PackageInstalledVersion.setContent(this.currentPackage.versionInstalled), this.$.PackageInstalledDate.setContent(this.currentPackage.dateInstalled), this.$.PackageInstalledSize.setContent(this.currentPackage.sizeInstalled), this.$.PackageID.setContent(this.currentPackage.pkg), this.$.PackageLicense.setContent(this.currentPackage.license), this.$.PackageType.setContent(this.currentPackage.type), this.$.PackageCategory.setContent(this.currentPackage.category), this.$.PackageFeed.setContent(this.currentPackage.feedString), this.$.InstallButton.setDisabled(this.currentPackage.isInstalled), this.$.UpdateButton.setDisabled(!this.currentPackage.isInstalled || !this.currentPackage.hasUpdate), this.$.RemoveButton.setDisabled(!this.currentPackage.isInstalled), this.$.LaunchButton.setDisabled(!this.currentPackage.isInstalled);
},
setupTypeItem: function(e, t) {
return t.item.$.listItem.$.ItemTitle.setContent(preware.PackagesModel.types[t.index]), !0;
},
setupCategoryItem: function(e, t) {
return t.item.$.listItem.$.ItemTitle.setContent(this.availableCategories[t.index]), !0;
},
setupPackageItem: function(e, t) {
var n = this.availablePackages[t.index];
return n && n.title && (t.item.$.listItem.$.ItemTitle.setContent(n.title), t.item.$.listItem.$.ItemIcon.setSrc(n.icon)), !0;
}
}), enyo.kind({
name: "App",
layoutKind: "FittableRowsLayout",
components: [ {
kind: "Signals",
onbackbutton: "handleBackGesture",
onCoreNaviDragStart: "handleCoreNaviDragStart",
onCoreNaviDrag: "handleCoreNaviDrag",
onCoreNaviDragFinish: "handleCoreNaviDragFinish"
}, {
name: "AppPanels",
kind: "AppPanels",
fit: !0
}, {
kind: "CoreNavi",
fingerTracking: !0
} ],
handleBackGesture: function(e, t) {
this.$.AppPanels.setIndex(0);
},
handleCoreNaviDragStart: function(e, t) {
this.$.AppPanels.dragstartTransition(this.$.AppPanels.draggable === !1 ? this.reverseDrag(t) : t);
},
handleCoreNaviDrag: function(e, t) {
this.$.AppPanels.dragTransition(this.$.AppPanels.draggable === !1 ? this.reverseDrag(t) : t);
},
handleCoreNaviDragFinish: function(e, t) {
this.$.AppPanels.dragfinishTransition(this.$.AppPanels.draggable === !1 ? this.reverseDrag(t) : t);
},
reverseDrag: function(e) {
return e.dx = -e.dx, e.ddx = -e.ddx, e.xDirection = -e.xDirection, e;
}
});

// cookie.js

enyo.singleton({
name: "preware.PrefCookie",
published: {
prefs: !1
},
get: function(e) {
try {
if (!this.prefs || e) this.prefs = {
theme: "palm-default",
updateInterval: "launch",
lastUpdate: 0,
fixUnknown: !0,
avoidBugs: !0,
useTuckerbox: !1,
ignoreDevices: !1,
showAvailableTypes: !1,
showTypeApplication: !0,
showTypeTheme: !1,
showTypePatch: !0,
showTypeOther: !0,
listSort: "default",
secondRow: "version,maint",
listInstalled: !1,
searchDesc: !1,
backgroundUpdates: "disabled",
autoInstallUpdates: !1,
blackList: [],
blackAuto: "none",
resourceHandlerCheck: !0,
rodMode: !1,
browseFromRoot: !1
}, this.getAllValues();
return this.prefs;
} catch (t) {
enyo.error("preferenceCookie#get", t);
}
},
getAllValues: function() {
var e, t;
if (enyo.getCookie("preware-cookie-set")) for (e in this.prefs) this.prefs.hasOwnProperty(e) && (t = enyo.getCookie(e), t !== undefined && (this.prefs[e] = t)); else this.setAllValues();
},
put: function(e, t) {
try {
t ? (this.prefs[e] = t, enyo.setCookie(e, t)) : (this.prefs = e, this.setAllValues());
} catch (n) {
enyo.error("preferenceCookie#put", n);
}
},
setAllValues: function() {
var e;
for (e in this.prefs) this.prefs.hasOwnProperty(e) && enyo.setCookie(e, this.prefs[e]);
enyo.setCookie("preware-cookie-set", !0);
}
}), enyo.singleton({
name: "preware.VersionCookie",
isFirst: !1,
isNew: !1,
init: function() {
var e;
this.cookie = !1, this.isFirst = !1, this.isNew = !1, e = enyo.getCookie("version"), e ? e === preware.Globals.getAppVersion() ? enyo.log("VersionCookie: Same version.") : (this.isNew = !0, enyo.setCookie("version", preware.Globals.getAppVersion()), enyo.log("VersionCookie: New version.")) : (this.isFirst = !0, this.isNew = !0, enyo.setCookie("version", preware.Globals.getAppVersion()), enyo.log("VersionCookie: First run."));
},
showStartupScene: function() {
return this.isNew || this.isFirst ? !0 : !1;
}
});

// db8storage.js

enyo.kind({
name: "DbService"
});

var preware2Domain = "org.webosinternals.preware2";

enyo.singleton({
name: "preware.db8Storage",
kinds: [ {
owner: preware2Domain,
indexes: [ {
name: "display",
props: [ {
name: "display",
type: "single",
tokenize: "all",
collate: "primary"
} ]
} ]
} ],
components: [ {
kind: "DbService",
dbKind: preware2Domain + ".justType:1",
onFailure: "dbFailure",
onSuccess: "dbSuccess",
components: [ {
name: "putOneKind",
method: "putKind"
}, {
name: "putPermission",
method: "putPermissions"
}, {
name: "putData",
method: "put"
}, {
name: "deleteAllData",
method: "del",
onSuccess: "deleteAllSuccess",
onFailure: "deleteAllFailure"
} ]
} ],
create: function() {
this.inherited(arguments), this.putKinds(), this.setupJustType();
},
putKinds: function() {
var e;
for (e = 0; e < this.kinds.length; e += 1) ;
},
setupJustType: function() {
var e = [ {
type: "db.kind",
object: preware2Domain + ".justType:1",
caller: "com.palm.launcher",
operations: {
read: "allow"
}
} ];
},
putArray: function(e) {
this.$.putData.call({
objects: e
});
},
deleteAll: function(e) {
enyo.error("db8storage.deleteAll is only a stub."), this.callback = e;
},
deleteAllSuccess: function(e, t) {
enyo.log("Delete all success."), this.callback && this.callback({
success: !0
});
},
deleteAllFailure: function(e, t, n) {
enyo.error("delete all failure: ", t), this.callback && this.callback({
success: !1
});
},
dbSuccess: function(e, t) {
enyo.log("DB8 operation " + JSON.stringify(t) + " success.");
},
dbFailure: function(e, t, n) {
enyo.error("db8Failure: ", t);
}
});

// deviceProfile.js

enyo.singleton({
name: "preware.DeviceProfile",
deviceProfile: !1,
deviceId: !1,
doDeviceProfileReady: function(e) {
this.callback && this.callback(null, e);
},
doDeviceIdReady: function(e) {
this.callback && this.callback(null, e);
},
getDeviceProfile: function(e, t) {
this.callback = e, this.deviceProfile && !t ? this.doDeviceProfileReady({
deviceProfile: this.deviceProfile,
success: !0,
message: ""
}) : (this.deviceProfile = !1, this.deviceId = !1, preware.IPKGService.impersonate(this._gotDeviceProfile.bind(this), "com.palm.configurator", "com.palm.deviceprofile", "getDeviceProfile", {}));
},
_gotDeviceProfile: function(e) {
e.returnValue === !1 ? this.doDeviceProfileReady({
deviceProfile: !1,
success: !1,
message: e.errorText
}) : (this.deviceProfile = e.deviceInfo, this.deviceProfile.deviceId === "" && (this.deviceProfile.deviceId = this.deviceProfile.nduId), this.doDeviceProfileReady({
deviceProfile: this.deviceProfile,
success: !0,
message: ""
}));
},
getDeviceId: function(e, t) {
this.callback = e, this.deviceId && !t ? this.doDeviceIdRead({
deviceId: this.deviceId,
success: !0,
message: ""
}) : (this.deviceId = !1, preware.IPKGService.impersonate(this._gotDeviceId.bind(this), "com.palm.configurator", "com.palm.deviceprofile", "getDeviceId", {}));
},
_gotDeviceId: function(e) {
e.returnValue === !1 ? this.doDeviceIdReady({
deviceId: !1,
success: !1,
message: e.errorText
}) : (this.deviceId = e.deviceId, this.doDeviceIdReady({
deviceId: this.deviceId,
success: !0,
message: ""
}));
}
});

// feeds.js

enyo.singleton({
name: "preware.FeedsModel",
feeds: [],
subscription: !1,
log: function(e) {
enyo.error(e), this.owner.log(e);
},
doLoadFeedsFinished: function(e) {
this.callback && this.callback({}, e.feeds);
},
loadFeeds: function(e) {
this.callback = e;
try {
this.feeds = [], this.log("calling list configs"), this.subscription = preware.IPKGService.list_configs(this.onConfigs.bind(this));
} catch (t) {
enyo.error("feedsModel#loadFeeds", t);
}
},
getFeedUrl: function(e) {
var t;
if (e && this.feeds.length > 0) for (t = 0; t <= this.feeds.length; t += 1) if (this.feeds[t].name === e) return this.feeds[t].url;
return !1;
},
onConfigs: function(e) {
var t, n, r, i, s;
this.log("configs returned: " + JSON.stringify(e));
try {
if (!e) this.doLoadFeedsFinished({
success: !1,
message: $L("Cannot access the service. First try restarting Preware, or reboot your device and try again.")
}); else if (e.errorCode !== undefined) e.errorText === "org.webosinternals.ipkgservice is not running." ? this.doLoadFeedsFinished({
success: !1,
message: $L("Cannot access the service. First try restarting Preware, or reboot your device and try again.")
}) : this.doLoadFeedsFinished({
success: !1,
message: e.errorText
}); else {
this.feeds = [];
for (t = 0; t < e.configs.length; t += 1) if (e.configs[t].enabled && e.configs[t].contents) {
r = e.configs[t].contents.split("<br>");
for (n = 0; n < r.length; n += 1) r[n] && (i = r[n].split(" "), s = {}, s.gzipped = i[0] === "src/gz" ? !0 : !1, s.name = i[1], s.url = i[2], this.feeds.push(s));
}
this.feeds.sort(function(e, t) {
return e.name && t.name ? e.name < t.name ? -1 : e.name > t.name ? 1 : 0 : -1;
}), enyo.log("Loading finished, feeds: " + JSON.stringify(this.feeds)), this.doLoadFeedsFinished({
feeds: this.feeds,
success: !0
});
}
} catch (o) {
enyo.error("feedsModel#onFeeds", o), this.doLoadFeedsFinished({
success: !1,
message: o
});
}
}
});

// filePicker.js

enyo.kind({
name: "preware.FilePicker",
published: {
num: 0,
type: "file",
root: !1,
topLevel: this.root ? "/" : "/media/internal/",
pop: !1,
folder: this.topLevel,
extensions: [],
sceneTitle: !1,
stageName: !1,
sceneName: !1,
popped: !1
},
events: {
onListingDone: "",
onSelect: ""
},
statics: {
num: 0,
folderRegExp: new RegExp(/^\./),
fileRegExp: new RegExp("^(.+)/([^/]+)$"),
extensionRegExp: new RegExp(/\.([^\.]+)$/)
},
create: function() {
this.inherited(arguments), FilePicker.num += 1, this.num = FilePicker.num, this.stageName || (this.stageName = "filePicker-" + this.num), this.sceneName || (this.sceneName = this.type + "-picker"), this.openFilePicker();
},
getDirectory: function(e) {
IPKGService.getDirListing(this.parseDirectory.bind(this, e), e);
},
parseDirectory: function(e, t) {
var n = [], r;
if (t.contents.length > 0) for (r = 0; r < t.contents.length; r += 1) !t.contents[r].name.match(FilePicker.folderRegExp) && (this.validExtension(t.contents[r].name) && t.contents[r].type === "file" || t.contents[r].type !== "file") && n.push({
name: t.contents[r].name,
type: t.contents[r].type,
location: e + t.contents[r].name
});
n.length > 0 && n.sort(function(e, t) {
var n, r;
return e.name && t.name ? (n = e.name.toLowerCase(), r = t.name.toLowerCase(), n < r ? -1 : n > r ? 1 : 0) : -1;
}), this.doListingDone({
results: n,
directory: e,
success: !0
});
},
getDirectories: function(e) {
IPKGService.getDirListing(this.parseDirectories.bind(this, e), e);
},
parseDirectories: function(e, t) {
var n = [], r;
if (t.contents.length > 0) for (r = 0; r < t.contents.length; r += 1) !t.contents[r].name.match(FilePicker.folderRegExp) && t.contents[r].type === "directory" && n.push({
name: t.contents[r].name,
type: t.contents[r].type,
location: e + t.contents[r].name
});
n.length > 0 && n.sort(function(e, t) {
var n, r;
return e.name && t.name ? (n = e.name.toLowerCase(), r = t.name.toLowerCase(), n < r ? -1 : n > r ? 1 : 0) : -1;
}), this.doListingDone({
results: n,
directory: e,
success: !0
});
},
ok: function(e) {
this.doSelect({
value: e,
success: !0
});
},
cancel: function() {
this.doSelect({
value: !1,
success: !1
});
},
validExtension: function(e) {
var t;
if (this.extensions.length > 0) return t = FilePicker.extensionRegExp.exec(e), t && t.length > 1 && this.extensions.include(t[1].toLowerCase()) ? !0 : !1;
return !0;
},
parseFileString: function(e) {
return e.replace(/\/media\/internal\//i, "USB/");
},
parseFileStringForId: function(e) {
return e.toLowerCase().replace(/\//g, "-").replace(/ /g, "-").replace(/\./g, "-");
},
getFileName: function(e) {
var t = FilePicker.fileRegExp.exec(e);
return t && t.length > 1 ? t[2] : e;
}
});

// help.js

enyo.singleton({
name: "preware.HelpData",
get: function(e) {
return this.lookup[e] ? this.lookup[e] : {
title: e.replace(/_/g, " ").replace(/-/g, " "),
data: "This section isn't setup. Call a Programmer! Tell Him: \"" + e + '"s.'
};
},
lookup: {
theme: {
title: $L("Theme"),
data: $L("This changes the entire look of the app. The options themselves should be self-explanatory.")
},
updateInterval: {
title: $L("Update Feeds"),
data: $L("This changes the frequency in which feeds are updated from the web. The feeds will always be loaded on every start. This simply determines if the feeds are updated before they're loaded.<ul><li><b>Every Launch</b> - Always update every time you open preware.</li><li><b>Once Daily</b> - Only update if it's been 24 hours since the last time the feeds were updated.</li><li><b>Manually Only</b> - Will never update feeds at start. It will only update when you trigger it manually from the prewares main scene.</li><li><b>Ask At Launch</b> - Asks you at launch whether or not you want to update the feeds this load.</li></ul>")
},
lastUpdate: {
title: $L("Last Update"),
data: $L("This displays the date the last time the feeds were downloaded from the web.")
},
fixUnknown: {
title: $L("Scan Unknown Packages"),
data: $L('This will scan the "appinfo.js" file for installed apps that are not in any of the feeds. This way you still get some information about the app. This stops "This is a webOS application." from being listed as installed.')
},
resourceHandlerCheck: {
title: $L("Check .ipk Association"),
data: $L("When this is on, Preware will check to see if it is the default handler for ipkg files, and will ask the user to rectify that if it is not.")
},
useTuckerbox: {
title: $L("Use App Tuckerbox"),
data: $L("App Tuckerbox is a homebrew app that allows you to register your device for direct access to information gathered from the HP App Catalog, Web and Beta feeds. When this option is on, Preware will install apps directly from the HP servers using information from these App Tuckerbox feeds. This may allow you to bypass device, region and carrier restrictions for free and previously purchased apps. This does not bypass purchase, and Preware cannot purchase apps. Note that your device must be registered with App Tuckerbox to access these feeds.")
},
ignoreDevices: {
title: $L("Ignore Device Compat."),
data: $L("Preware normally only shows apps that are compatible with your device. When this option is on, Preware will show all apps, regardless of device compatibility. Note that apps that are not compatible with your device may not operate correctly.")
},
showAvailableTypes: {
title: $L("Show Available Types"),
data: $L('When off, only shows "Available Packages" on the main scene, and allows you to branch into the different types from there.<br>When oo, it will open up the options to choose which package types are linked directly from the main scene.')
},
showTypeApplication: {
title: $L("Show Applications"),
data: $L('When on, "Available Applications" will appear on the main scene.')
},
showTypeTheme: {
title: $L("Show Themes"),
data: $L('When on, "Available Themes" will appear on the main scene.')
},
showTypePatch: {
title: $L("Show Patches"),
data: $L('When on, "Available Patches" will appear on the main scene.')
},
showTypeOther: {
title: $L("Show Other Types"),
data: $L('When on, "Available Other" will appear on the main scene. It will include anything which doesn\'t fit into any of the other categories (like kernels, linux apps, etc.).')
},
searchDesc: {
title: $L("Search Descriptions"),
data: $L("With this turned on, package searches performed in preware (usually by just starting to type in list scenes or the main scene) will also search descriptions for what you typed in. It takes a little longer, but sometimes gets you better results.")
},
listSort: {
title: $L("Default Sort"),
data: $L("This allows you to change the default sort for lists of packages.<ul><li><b>Category Default</b> - Use the default sorts that we feel fit best for each of the package lists.</li><li><b>Alphabetically</b> - Sorts them alphabetically by package name, obviously.</li><li><b>Last Updated</b> - Sorts by the date the package was last updated.</li><li><b>Price</b> - Again, this one is pretty obvious.</li></ul>")
},
secondRow: {
title: $L("Second Line"),
data: $L("This selects what package data appears in the package lists under the packages title.")
},
listInstalled: {
title: $L("Installed Is Available"),
data: $L('When this option is on, packages that are installed appear in the "Available Packages" and lists like it. With it off, they only appear in the installed list or updates when applicable.')
},
onlyShowFree: {
title: $L("Only Show Free Apps"),
data: $L("This option ignores all packages that cost money (catalog apps) and only displays the free ones.")
},
onlyShowEnglish: {
title: $L("Only Show English Apps"),
data: $L("When on, preware will only show english apps.")
},
browseFromRoot: {
title: $L("Browse From Root"),
data: $L("When enabled, will allow you to browse outside /media/internal in the file picker for single package install.")
}
}
});

// IPKGService.js

enyo.singleton({
name: "preware.IPKGService",
identifier: "palm://org.webosinternals.ipkgservice",
log: "",
logNum: 1,
generalSuccess: function(e, t) {
e && e(t);
},
generalFailure: function(e, t) {
enyo.error("IPKGService#generalFailure", t), e && e(t);
},
_serviceCall: function(e, t, n) {
var r = navigator.service.Request(this.identifier, {
method: t,
parameters: n,
onSuccess: this.generalSuccess.bind(this, e),
onFailure: this.generalFailure.bind(this, e)
});
return r;
},
version: function(e) {
return this._serviceCall(e, "version");
},
getMachineName: function(e) {
return this._serviceCall(e, "getMachineName");
},
impersonate: function(e, t, n, r, i) {
var s = {
id: t,
service: n,
method: r,
params: i,
subscribe: i.subscribe ? !0 : !1
};
return this._serviceCall(e, "impersonate", s);
},
setAuthParams: function(e, t, n) {
var r = {
deviceId: t,
token: n
};
return this._serviceCall(e, "setAuthParams", r);
},
list_configs: function(e) {
return this._serviceCall(e, "getConfigs");
},
setConfigState: function(e, t, n) {
var r = {
config: t,
enabled: n
};
return this._serviceCall(e, "setConfigState", r);
},
extractControl: function(e, t, n) {
var r = {
filename: t,
url: n
};
return this._serviceCall(e, "extractControl", r);
},
update: function(e) {
return this._serviceCall(e, "update", {
subscribe: !0
});
},
getDirListing: function(e, t) {
return this._serviceCall(e, "getDirListing", {
directory: t
});
},
downloadFeed: function(e, t, n, r) {
var i = {
subscribe: !0,
gzipped: t,
feed: n,
url: r
};
return this._serviceCall(e, "downloadFeed", i);
},
getListFile: function(e, t) {
var n = {
subscribe: !0,
feed: t
};
return this._serviceCall(e, "getListFile", n);
},
getStatusFile: function(e) {
var t = {
subscribe: !0
};
return this._serviceCall(e, "getStatusFile", t);
},
install: function(e, t, n) {
var r = {
subscribe: !0,
filename: t,
url: n
};
return this._serviceCall(e, preware.PrefCookie.get().avoidBugs ? "installSvc" : "installCli", r);
},
replace: function(e, t, n, r) {
var i = {
"package": t,
subscribe: !0,
filename: n,
url: r
};
return this._serviceCall(e, preware.PrefCookie.get().avoidBugs ? "replaceSvc" : "replaceCli", i);
},
remove: function(e, t) {
var n = {
"package": t,
subscribe: !0
};
return this._serviceCall(e, "remove", n);
},
rescan: function(e) {
return this._serviceCall(e, "rescan");
},
restartLuna: function(e) {
return this._serviceCall(e, "restartLuna");
},
restartjava: function(e) {
return this._serviceCall(e, "restartjava");
},
restartDevice: function(e) {
return this._serviceCall(e, "restartDevice");
},
getAppinfoFile: function(e, t) {
var n = {
"package": t
};
return this._serviceCall(e, "getAppinfoFile", n);
},
getControlFile: function(e, t) {
var n = {
"package": t
};
return this._serviceCall(e, "getControlFile", n);
},
getPackageInfo: function(e, t) {
var n = {
"package": t,
subscribe: !0
};
return this._serviceCall(e, "getPackageInfo", n);
},
addConfig: function(e, t, n, r, i) {
var s = {
subscribe: !0,
config: t,
name: n,
url: r,
gzip: i
};
return this._serviceCall(e, "addConfig", s);
},
deleteConfig: function(e, t, n) {
var r = {
subscribe: !0,
config: t,
name: n
};
return this._serviceCall(e, "deleteConfig", r);
},
installStatus: function(e) {
return this._serviceCall(e, "installStatus");
},
logClear: function() {
this.log = "", this.logNum = 1;
},
logPayload: function(e, t) {
if (e.stage && e.stage !== "status" || t) {
var n, r;
this.log += '<div class="container ' + (this.logNum % 2 ? "one" : "two") + '">', e.stage ? this.log += '<div class="title">' + e.stage + "</div>" : t && (this.log += '<div class="title">' + t + "</div>"), r = !1;
if (e.errorCode || e.errorText) r = !0, this.log += '<div class="stdErr">', this.log += "<b>" + e.errorCode + "</b>: ", this.log += e.errorText, this.log += "</div>";
if (e.stdOut && e.stdOut.length > 0) {
r = !0, this.log += '<div class="stdOut">';
for (n = 0; n < e.stdOut.length; n += 1) this.log += "<div>" + e.stdOut[n] + "</div>";
this.log += "</div>";
}
if (e.stdErr && e.stdErr.length > 0) {
r = !0, this.log += '<div class="stdErr">';
for (n = 0; n < e.stdErr.length; n += 1) e.stdErr[n].include($L("(offline root mode: not running ")) || (this.log += "<div>" + e.stdErr[n] + "</div>");
this.log += "</div>";
}
r || (this.log += $L('<div class="msg">Nothing Interesting.</div>')), this.log += "</div>", this.logNum += 1;
}
}
});

// packageModel.js

enyo.kind({
name: "preware.PackageModel",
kind: "enyo.Control",
subscription: !1,
assistant: !1,
doSimpleMessage: function(e) {
var t = "";
e.error && (t = "ERROR: "), t += e.msg, e.progress && (t += " - Progress: " + e.progValue), enyo.Signals.send("onPackageSimpleMessage", e);
},
doProgressMessage: function(e) {
var t = "";
e.error && (t = "ERROR: "), t += e.msg, e.progress && (t += " - Progress: " + e.progValue), enyo.Signals.send("onPackageProgressMessage", e);
},
constructor: function(e) {
this.inherited(arguments);
try {
this.pkg = e && e.pkg ? e.pkg : !1, this.type = e && e.type ? e.type : !1, this.category = !1, this.version = !1, this.maintainer = !1, this.title = e && e.title ? e.title : !1, this.size = !1, this.filename = e && e.filename ? e.filename : !1, this.location = e && e.location ? e.location : !1, this.hasUpdate = !1, this.icon = !1, this.iconImg = {
object: !1,
loading: !1,
loaded: !1,
target: !1,
local: !1
}, this.date = !1, this.price = !1, this.feeds = [ "Unknown" ], this.feedString = "Unknown", this.countries = [], this.countryString = !1, this.languages = [], this.languageString = !1, this.homepage = !1, this.license = !1, this.description = !1, this.changelog = !1, this.screenshots = [], this.depends = [], this.flags = {
install: {
RestartLuna: !1,
RestartJava: !1,
RestartDevice: !1
},
update: {
RestartLuna: !1,
RestartJava: !1,
RestartDevice: !1
},
remove: {
RestartLuna: !1,
RestartJava: !1,
RestartDevice: !1
}
}, this.isInstalled = !1, this.dateInstalled = !1, this.sizeInstalled = !1, this.appCatalog = !1, this.isInSavedList = !1, this.minWebOSVersion = "1.0.0", this.maxWebOSVersion = "99.9.9", this.devices = [], this.deviceString = !1, this.preInstallMessage = !1, this.preUpdateMessage = !1, this.preRemoveMessage = !1, this.blacklisted = !1, this.infoLoad(e);
if (!this.category || this.category === "misc") this.category = "Unsorted";
this.type || (this.type = "Unknown");
} catch (t) {
enyo.error("PackageModel#create", t);
}
},
infoUpdate: function(e) {
try {
var t = preware.PackagesModel.versionNewer(this.version, e.version);
return !e.isInstalled && !this.isInstalled && t ? (e.infoLoadFromPkg(this), e) : e.isInstalled && !this.isInstalled && !t ? (this.isInstalled = !0, this.hasUpdate = !0, this.versionInstalled = e.version, this.infoLoadFromPkg(e), !1) : !e.isInstalled && this.isInstalled && !t ? (this.isInstalled = !0, this.infoLoadFromPkg(e), !1) : e.isInstalled && !this.isInstalled && t ? (e.isInstalled = !0, e.versionInstalled = this.version, e.infoLoadFromPkg(this), e) : !e.isInstalled && this.isInstalled && t ? (e.isInstalled = !0, e.hasUpdate = !0, e.versionInstalled = this.version, e.infoLoadFromPkg(this), e) : !1;
} catch (n) {
enyo.error("PackageModel#infoUpdate", n);
}
},
infoLoad: function(e) {
var t, n, r, i, s, o = {}, u, a, f;
try {
this.pkg = this.pkg || e.Package, this.version = this.version || e.version, this.size = e.size || e.Size, this.filename = this.filename || e.Filename, e.Status && !e.Status.include("not-installed") && !e.Status.include("deinstall") && (this.isInstalled = !0, this.dateInstalled = e["Installed-Time"] && isNumeric(e["Installed-Time"]) ? e["Installed-Time"] : !1, this.sizeInstalled = e["Installed-Size"]);
if ((!this.depends || this.depends.length === 0) && e.Depends) {
t = e.Depends.split(",");
for (n = 0; n < t.length; n += 1) r = new RegExp("^([^(]*)[s]*[(]?([^0-9]*)[s]*([0-9.]*)[)]?"), i = t[n].match(r), i && (i[2] ? i[2] = trim(i[2]) : i[2] = !1, i[3] ? i[3] = trim(i[3]) : i[3] = !1, this.depends.push({
pkg: trim(i[1]),
match: i[2],
version: i[3]
}));
}
if (e.Source && e.Source.include("{")) {
try {
o = JSON.parse(e.Source.replace(/\\'/g, "'"));
} catch (l) {
enyo.error("PackageModel#infoLoad#parse(" + this.pkg + "): " + e.Source, l), o = {};
}
(!this.type || this.type === "Unknown") && o.Type && (this.type = o.Type), o.Type === "AppCatalog" && (this.type = "Application", this.appCatalog = !0), this.category = this.category || o.Category, this.title = this.title || o.Title, this.icon = this.icon || o.Icon, this.homepage = this.homepage || o.Homepage, this.filename = this.filename || o.Filename, this.location = this.location || o.Location, this.license = this.license || o.License, this.description = this.description || o.FullDescription, this.changelog = this.changelog || o.Changelog, this.preInstallMessage = this.preInstallMessage || o.PreInstallMessage, this.preUpdateMessage = this.preUpdateMessage || o.PreUpdateMessage, this.preRemoveMessage = this.preRemoveMessage || o.PreRemoveMessage, this.date = this.date || isNumeric(o.LastUpdate) ? o.LastUpdate : undefined, (!this.screenshots || this.screenshots.length === 0) && o.Screenshots && (this.screenshots = o.Screenshots), !this.price && o.Price && (this.price = o.Price, preware.Packages.hasPrices = !0), o.MinWebOSVersion && (this.minWebOSVersion = o.MinWebOSVersion), o.MaxWebOSVersion && (this.maxWebOSVersion = o.MaxWebOSVersion), o.DeviceCompatibility && (this.devices = o.DeviceCompatibility, this.deviceString = o.DeviceCompatibility.join(", ")), o.Feed && (this.feeds = [ o.Feed ], this.feedString = o.Feed), o.Countries && (this.countries = o.Countries, this.countryString = o.Countries.join(", ")), o.Languages && (this.languages = o.Languages, this.languageString = o.Languages.join(", ")), o.PostInstallFlags && (this.flags.install.RestartLuna = o.PostInstallFlags.include("RestartLuna"), this.flags.install.RestartJava = o.PostInstallFlags.include("RestartJava"), this.flags.install.RestartDevice = o.PostInstallFlags.include("RestartDevice")), o.PostUpdateFlags && (this.flags.update.RestartLuna = o.PostUpdateFlags.include("RestartLuna"), this.flags.update.RestartJava = o.PostUpdateFlags.include("RestartJava"), this.flags.update.RestartDevice = o.PostUpdateFlags.include("RestartDevice")), o.PostRemoveFlags && (this.flags.remove.RestartLuna = o.PostRemoveFlags.include("RestartLuna"), this.flags.remove.RestartJava = o.PostRemoveFlags.include("RestartJava"), this.flags.remove.RestartDevice = o.PostRemoveFlags.include("RestartDevice"));
}
!this.category && e.Section && (this.category = e.Section), !this.title && e.Description && (this.title = e.Description);
if ((!this.maintainer || this.maintainer.length === 0) && e.Maintainer) {
this.maintainer = [], t = e.Maintainer.split(","), r = new RegExp("^([^<]*)<([^>]*)>?");
for (n = 0; n < t.length; n += 1) i = trim(t[n]).match(r), i ? (s = {
name: trim(i[1]),
url: i[2]
}, s.url.include("@") && (s.url === "palm@palm.com" || s.url === "nobody@example.com" ? s.url = !1 : s.url = "mailto:" + s.url + "?subject=" + this.title), this.maintainer.push(s)) : this.maintainer.push({
name: trim(t[n]),
url: !1
});
}
u = preware.PrefCookie.get().blackList;
if (!this.blacklisted && u.length > 0 && !this.isInstalled && !this.isInSavedList) for (a = 0; a < u.length; a += 1) if (!this.blacklisted) if (u[a].field === "title" && this.title && this.title.toLowerCase().include(u[a].search.toLowerCase())) this.blacklisted = !0; else if (u[a].field === "maintainer" && this.maintainer.length > 0) for (f = 0; f < this.maintainer.length; f += 1) this.maintainer[f].name.toLowerCase().include(u[a].search.toLowerCase()) && (this.blacklisted = !0); else u[a].field === "id" && this.pkg.toLowerCase().include(u[a].search.toLowerCase()) ? this.blacklisted = !0 : u[a].field === "desc" && this.description && this.description.toLowerCase().include(u[a].search.toLowerCase()) ? this.blacklisted = !0 : u[a].field === "category" && this.category && this.category.toLowerCase().include(u[a].search.toLowerCase()) && (this.blacklisted = !0);
} catch (c) {
enyo.error("PackageModel#infoLoad", c);
}
},
infoLoadFromPkg: function(e) {
try {
(!this.type || this.type === "Unknown") && e.type && (this.type = e.type), this.appCatalog || this.type === "AppCatalog" || e.appCatalog || e.type === "AppCatalog" ? (this.type = "Application", this.appCatalog = !0) : this.appCatalog = !1, e.blacklisted === !0 && (this.blacklisted = !0);
if (!this.title || this.title === "This is a webOS application.") this.title = e.title;
this.category === "Unsorted" && (this.category = e.category);
if (!this.maintainer || this.maintainer.length === 0 || this.maintainer.length === 1 && this.maintainer[0].name === "N/A") this.maintainer = e.maintainer;
this.date = this.date || isNumeric(e.date) ? e.date : undefined, this.dateInstalled = this.dateInstalled || isNumeric(e.dateInstalled) ? e.dateInstalled : undefined, this.maintUrl = this.maintUrl || e.maintUrl, this.size = this.size || e.size, this.filename = this.filename || e.filename, this.location = this.location || e.location, this.price = this.price || e.price, this.homepage = this.homepage || e.homepage, this.license = this.license || e.license, this.description = this.description || e.description, this.changelog = this.changelog || e.changelog, this.isInstalled = this.isInstalled || e.isInstalled, this.hasUpdate = this.hasUpdate || e.hasUpdate, this.sizeInstalled = this.sizeInstalled || e.sizeInstalled, this.isInSavedList = this.isInSavedList || e.isInSavedList, this.preInstallMessage = this.preInstallMessage || e.preInstallMessage, this.preUpdateMessage = this.preUpdateMesssage || e.preUpdateMessage, this.preRemoveMessage = this.preRemoveMessage || e.preRemoveMessage, this.icon || (this.icon = e.icon, this.iconImg.local = !1), this.feeds[0] === "Unknown" && (this.feeds = e.feeds, this.feedString = e.feedString), this.devices.length === 0 && (this.devices = e.devices, this.deviceString = e.deviceString), this.countries.length === 0 && (this.countries = e.countries, this.countryString = e.countryString), this.languages.length === 0 && (this.languages = e.languages, this.languageString = e.languageString), this.depends.length === 0 && e.depends.length > 0 && (this.depends = e.depends), this.screenshots.length === 0 && e.screenshots.length > 0 && (this.screenshots = e.screenshots), this.flags.install.RestartLuna = this.flags.install.RestartLuna || e.flags.install.RestartLuna, this.flags.install.RestartJava = this.flags.install.RestartJava || e.flags.install.RestartJava, this.flags.install.RestartDevice = this.flags.install.RestartDevice || e.flags.install.RestartDevice, this.flags.update.RestartLuna = this.flags.update.RestartLuna || e.flags.update.RestartLuna, this.flags.update.RestartJava = this.flags.update.RestartJava || e.flags.update.RestartJava, this.flags.update.RestartDevice = this.flags.update.RestartDevice || e.flags.update.RestartDevice, this.flags.remove.RestartLuna = this.flags.remove.RestartLuna || e.flags.remove.RestartLuna, this.flags.remove.RestartJava = this.flags.remove.RestartJava || e.flags.remove.RestartJava, this.flags.remove.RestartDevice = this.flags.remove.RestartDevice || e.flags.remove.RestartDevice;
} catch (t) {
enyo.error("PackageModel#infoLoadFromPkg (" + this.pkg + ")", t);
}
},
infoSave: function() {
var e = {}, t = [];
try {
e.Package = this.pkg, this.version && (e.Version = this.version), this.size && (e.Size = this.size), this.filename && (e.Filename = this.filename), this.title && (e.Description = this.title), this.appCatalog ? t.push('"Type": "AppCatalog"') : t.push('"Type": "' + this.type + '"'), this.category && t.push('"Category": "' + this.category + '"'), this.title && t.push('"Title": "' + this.title + '"'), this.icon && t.push('"Icon": "' + this.icon + '"'), this.date && t.push('"LastUpdated": "' + this.date + '"'), this.homepage && t.push('"Homepage": "' + this.homepage + '"'), this.license && t.push('"License": "' + this.license + '"'), this.description && t.push('"FullDescription": "' + this.description + '"'), this.changelog && t.push('"Changelog": "' + this.changelog + '"'), e.Source = "{ " + t.join(", ") + " }";
} catch (n) {
enyo.error("PackageModel#infoSave", n);
}
return e;
},
loadAppinfoFile: function(e) {
this.subscription = preware.IPKGService.getAppinfoFile(this.loadAppinfoFileResponse.bind(this, e), this.pkg);
},
loadAppinfoFileResponse: function(e, t) {
if (t.returnValue === !1) {
this.loadControlFile(e);
return;
}
if (t.stage === "start") this.rawData = ""; else if (t.stage === "middle") t.contents && (this.rawData += t.contents); else if (t.stage === "end") {
if (this.rawData !== "") {
var n = {};
try {
n = JSON.parse(this.rawData);
} catch (r) {
enyo.error("PackageModel#loadAppinfoFileResponse#parse" + this.rawData, r);
}
(!this.type || this.type === "" || this.type === "Unknown") && this.title === "This is a webOS application." && (this.type = "Application"), (!this.title || this.title === "" || this.title === "This is a webOS application.") && n.title && (this.title = n.title);
if (!this.icon || this.icon === "") this.iconImg.local = !0, n.icon ? this.icon = "../" + this.pkg + "/" + n.icon : this.icon = "../" + this.pkg + "/icon.png";
(!this.maintainer || this.maintainer.length === 0 || this.maintainer.length === 1 && this.maintainer[0].name === "N/A") && n.vendor && (this.maintainer = [ {
name: n.vendor,
url: !1
} ]);
}
this.loadControlFile(e);
}
},
loadControlFile: function(e) {
this.subscription = preware.IPKGService.getControlFile(this.loadControlFileResponse.bind(this, e), this.pkg);
},
loadControlFileResponse: function(e, t) {
if (t.returnValue === !1) {
e && e();
return;
}
var n, r, i, s, o;
if (t.stage === "start") this.rawData = ""; else if (t.stage === "middle") t.contents && (this.rawData += t.contents); else if (t.stage === "end") {
if (this.rawData !== "") {
n = this.rawData.split(/\n/), r = new RegExp(/[\s]*([^:]*):[\s]*(.*)[\s]*$/), i = {
Architecture: "",
Section: "",
Package: "",
Depends: "",
Maintainer: "",
Version: "",
Description: "",
Source: ""
};
for (o = 0; o < n.length; o += 1) s = r.exec(n[o]), s && s[1] && s[2] && (i[s[1]] = s[2]);
try {
this.infoLoad(i);
} catch (u) {
enyo.error("PackageModel#loadControlFileResponse#infoLoad" + this.rawData, u);
}
}
e && e();
}
},
inFeed: function(e) {
var t;
for (t = 0; t < this.feeds.length; t += 1) if (this.feeds[t] === e) return !0;
return !1;
},
inCountry: function(e) {
var t;
for (t = 0; t < this.countries.length; t += 1) if (this.countries[t] === e) return !0;
return !1;
},
inLanguage: function(e) {
var t;
for (t = 0; t < this.languages.length; t += 1) if (this.languages[t] === e) return !0;
return !1;
},
getDependencies: function(e) {
var t = [], n, r;
if (this.depends.length > 0) for (n = 0; n < this.depends.length; n += 1) if (preware.Packages.packages.length > 0) for (r = 0; r < preware.Packages.packages.length; r += 1) preware.Packages.packages[r].pkg === this.depends[n].pkg && (e ? preware.Packages.packages[r].isInstalled ? preware.Packages.packages[r].hasUpdate && t.push(r) : t.push(r) : t.push(r));
return t;
},
getDependenciesRecursive: function(e) {
var t = [], n = this.getDependenciesRecursiveFunction(e, 0), r, i, s;
if (n.length > 0) {
n.sort(function(e, t) {
return t.d - e.d;
});
for (r = 0; r < n.length; r += 1) {
s = !0;
if (t.length > 0) for (i = 0; i < t.length; i += 1) n[r].id === t[i] && (s = !1);
s && t.push(n[r].id);
}
}
return t;
},
getDependenciesRecursiveFunction: function(e, t) {
!t && t !== 0 && (t = 0);
var n = [], r = this.getDependencies(e), i, s, o;
if (r.length > 0) for (i = 0; i < r.length; i += 1) {
n.push({
d: t,
id: r[i]
}), o = preware.Packages.packages[r[i]].getDependenciesRecursiveFunction(e, t + 1);
if (o.length > 0) for (s = 0; s < o.length; s += 1) n.push({
d: o[s].d,
id: o[s].id
});
}
return n;
},
getDependent: function(e, t) {
var n = [], r = [], i, s;
for (i = 0; i < preware.Packages.packages.length; i += 1) for (s = 0; s < preware.Packages.packages[i].depends.length; s += 1) preware.Packages.packages[i].depends[s].pkg === this.pkg && (e ? preware.Packages.packages[i].isInstalled && n.push(i) : n.push(i));
if (n.length > 0 && t) {
for (i = 0; i < n.length; i += 1) preware.Packages.packages[n[i]].isInstalled && r.push(n[i]);
for (i = 0; i < n.length; i += 1) preware.Packages.packages[n[i]].isInstalled || r.push(n[i]);
} else r = n;
return r;
},
matchItem: function(e) {
var t = !1;
return this.blacklisted ? !1 : (e.pkgList === "all" || e.pkgList === "other" && this.type !== "Application" && this.type !== "Theme" && this.type !== "Patch" ? (t = !0, this.isInstalled && !preware.PrefCookie.get().listInstalled && (t = !1, e.pkgType === "all" && e.pkgFeed === "all" && e.pkgCat === "all" && (t = !0)), !this.isInstalled && this.isInSavedList && this.feeds[0] === "Unknown" && (t = !1)) : e.pkgList === "updates" && this.hasUpdate ? t = !0 : e.pkgList === "installed" && this.isInstalled ? t = !0 : e.pkgList === "saved" && this.isInSavedList && (!this.appCatalog || preware.PrefCookie.get().useTuckerbox) && (t = !0), e.pkgType !== "all" && e.pkgType !== "" && e.pkgType !== this.type && (t = !1), e.pkgFeed !== "all" && e.pkgFeed !== "" && !this.inFeed(e.pkgFeed) && (t = !1), e.pkgCat !== "all" && e.pkgCat !== "" && e.pkgCat !== this.category && (t = !1), t);
},
launch: function() {
if (this.isInstalled && this.type === "Application") var e = navigator.service.Request("palm://com.palm.applicationManager/", {
method: "launch",
parameters: {
id: this.pkg
}
});
},
doRedirect: function() {
navigator.Service.Request("palm://com.palm.applicationManager", {
method: "open",
parameters: {
target: "http://developer.palm.com/appredirect/?packageid=" + this.pkg
}
});
},
doInstall: function(e, t) {
try {
if (!e) {
this.doProgressMessage({
message: $L("Checking Dependencies")
});
var n = this.getDependenciesRecursive(!0);
if (n.length > 0) {
preware.PackagesModel.checkMultiInstall(this, n);
return;
}
}
t !== undefined ? (this.doProgressMessage({
message: $L("Downloading / Installing<br />") + this.title
}), preware.IPKGService.install(this.onInstall.bind(this, t), this.filename, this.location.replace(/ /g, "%20"))) : (this.doProgressMessage({
message: $L("Downloading / Installing")
}), preware.IPKGService.install(this.onInstall.bind(this), this.filename, this.location.replace(/ /g, "%20")));
} catch (r) {
enyo.error("packageModel#doInstall", r);
}
},
doUpdate: function(e, t) {
try {
if (!e) {
this.doProgressMessage({
message: $L("Checking Dependencies")
});
var n = this.getDependenciesRecursive(!0);
if (n.length > 0) {
preware.PackagesModel.checkMultiInstall(this, n);
return;
}
}
t !== undefined ? (this.doProgressMessage({
message: $L("Downloading / Updating<br />") + this.title
}), preware.typeConditions.can(this.type, "updateAsReplace") ? (preware.IPKGService.replace(this.onUpdate.bind(this, t), this.pkg, this.filename, this.location.replace(/ /g, "%20")), this.doProgressMessage({
message: "Downloading / Replacing<br />" + this.title
})) : preware.IPKGService.install(this.onUpdate.bind(this, t), this.filename, this.location.replace(/ /g, "%20"))) : (this.doProgressMessage({
message: $L("Downloading / Updating")
}), preware.typeConditions.can(this.type, "updateAsReplace") ? (preware.IPKGService.replace(this.onUpdate.bind(this), this.pkg, this.filename, this.location.replace(/ /g, "%20")), this.doProgressMessage({
message: $L("Downloading / Replacing")
})) : preware.IPKGService.install(this.onUpdate.bind(this), this.filename, this.location.replace(/ /g, "%20")));
} catch (r) {
enyo.error("packageModel#doUpdate", r);
}
},
doRemove: function(e) {
try {
if (!e) {
this.doProgressMessage({
message: $L("Checking Dependencies")
});
var t = this.getDependent(!0);
if (t.length > 0) {
preware.PackagesModel.checkMultiRemove(this, t, assistant);
return;
}
}
this.doProgressMessage({
message: $L("Removing")
}), preware.IPKGService.remove(this.onRemove.bind(this), this.pkg);
} catch (n) {
enyo.error("packageModel#doRemove", n);
}
},
onInstall: function(e, t) {
try {
preware.IPKGService.logPayload(e);
if (!e) var n = $L("Error Installing: Communication Error"), r = !0; else {
if (!e.returnValue) var n = $L("Error Installing: No Further Information"), r = !0;
if (e.stage == "failed") var n = $L("Error Installing: See IPKG Log"), r = !0; else {
if (e.stage == "status") {
this.doProgressMessage({
message: $L("Downloading / Installing<br />") + e.status
});
return;
}
if (e.stage == "completed") {
this.isInstalled = !0;
var n = this.type + $L(" installed");
enyo.Signals.send("onPackageRefresh");
if (t !== undefined) {
preware.PackagesModel.doMultiInstall(t + 1);
return;
}
if (this.hasFlags("install")) {
enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(n + ":<br /><br />" + this.actionMessage("install"), [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("Later"),
value: "skip"
} ], this.actionFunction.bindAsEventListener(this, "install"));
return;
}
this.runFlags("install");
} else {
if (e.errorText !== "org.webosinternals.ipkgservice is not running.") return;
this.isInstalled = !0;
var n = this.type + $L(" installed"), r = !0;
if (t !== undefined) {
preware.PackagesModel.doMultiInstall(t + 1);
return;
}
}
}
}
r ? (enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(n, [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("IPKG Log"),
value: "view-log"
} ], this.errorLogFunction.bindAsEventListener(this))) : this.doSimpleMessage(n);
} catch (i) {
enyo.error("packageModel#onInstall", i);
}
},
onUpdate: function(e, t) {
try {
preware.IPKGService.logPayload(e);
if (!e) var n = $L("Error Updating: Communication Error"), r = !0; else {
if (!e.returnValue) var n = $L("Error Updating: No Further Information"), r = !0;
if (e.stage == "failed") var n = $L("Error Updating: See IPKG Log"), r = !0; else {
if (e.stage == "status") {
this.doProgressMessage({
message: $L("Downloading / Updating<br />") + e.status
});
return;
}
if (e.stage == "completed") {
this.hasUpdate = !1;
var n = this.type + $L(" updated");
enyo.Signals.send("onPackageRefresh");
if (t !== undefined) {
preware.PackagesModel.doMultiInstall(t + 1);
return;
}
if (this.hasFlags("update")) {
enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(n + ":<br /><br />" + this.actionMessage("update"), [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("Later"),
value: "skip"
} ], this.actionFunction.bindAsEventListener(this, "update"));
return;
}
this.runFlags("update");
} else {
if (e.errorText !== "org.webosinternals.ipkgservice is not running.") return;
this.hasUpdate = !1;
var n = this.type + $L(" updated"), r = !0;
if (t !== undefined) {
preware.PackagesModel.doMultiInstall(t + 1);
return;
}
}
}
}
r ? (enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(n, [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("IPKG Log"),
value: "view-log"
} ], this.errorLogFunction.bindAsEventListener(this))) : this.doSimpleMessage(n);
} catch (i) {
enyo.error("packageModel#onUpdate", i);
}
},
onRemove: function(e) {
try {
preware.IPKGService.logPayload(e);
if (!e) var t = $L("Error Removing: Communication Error"), n = !0; else {
if (!e.returnValue) var t = $L("Error Removing: No Further Information"), n = !0;
if (e.stage == "failed") var t = $L("Error Removing: See IPKG Log"), n = !0; else {
if (e.stage == "status") {
enyo.error("assistant.displayAction not yet replaced, logging instead"), enyo.log($L("Removing<br />") + e.status);
return;
}
if (e.stage == "completed") {
this.hasUpdate = !1, this.isInstalled = !1, enyo.Signals.send("onPackageRefresh");
var t = this.type + $L(" removed");
if (this.hasFlags("remove")) {
enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(t + ":<br /><br />" + this.actionMessage("remove"), [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("Later"),
value: "skip"
} ], this.actionFunction.bindAsEventListener(this, "remove"));
return;
}
this.runFlags("remove");
} else {
if (e.errorText != "org.webosinternals.ipkgservice is not running.") return;
var t = this.type + $L(" removal probably failed"), n = !0;
}
}
}
n ? (enyo.error("assistant.actionMessage not yet replaced, logging instead"), enyo.log(t, [ {
label: $L("Ok"),
value: "ok"
}, {
label: $L("IPKG Log"),
value: "view-log"
} ], this.actionFunction.bindAsEventListener(this, "remove"))) : this.doSimpleMessage(t);
} catch (r) {
enyo.error(r, "packageModel#onRemove");
}
},
hasFlags: function(e) {
return this.flags[e].RestartLuna || this.flags[e].RestartJava || this.flags[e].RestartDevice ? !0 : !1;
},
runFlags: function(e) {
try {
if (this.flags[e].RestartJava && this.flags[e].RestartLuna || this.flags[e].RestartDevice) this.subscription = IPKGService.restartdevice(function() {});
this.flags[e].RestartJava && (this.subscription = IPKGService.restartjava(function() {})), this.flags[e].RestartLuna && (this.subscription = IPKGService.restartluna(function() {})), !preware.PrefCookie.get().avoidBugs && e != "remove" && (this.subscription = IPKGService.rescan(function() {}));
} catch (t) {
enyo.error(t, "packageModel#runFlags");
}
},
errorLogFunction: function(e) {
e == "view-log" && enyo.log("pushScene not yet replaced, open IPKG Log here");
return;
},
actionFunction: function(e, t) {
e == "ok" ? this.runFlags(t) : !prefs.get().avoidBugs && t != "remove" && (this.subscription = IPKGService.rescan(function() {}));
return;
},
actionMessage: function(e) {
var t = "";
this.flags[e].RestartJava && (t += $L("<b>Java Restart Is Required</b><br /><i>Once you press Ok your device will lose network connection and be unresponsive until it is done restarting.</i><br />")), this.flags[e].RestartLuna && (t += $L("<b>Luna Restart Is Required</b><br /><i>Once you press Ok all your open applications will be closed while luna restarts.</i><br />"));
if (this.flags[e].RestartJava && this.flags[e].RestartLuna || this.flags[e].RestartDevice) t = $L("<b>Device Restart Is Required</b><br /><i>You will need to restart your device to be able to use the package that you just installed.</i><br />");
return t;
}
});

// packagesModel.js

enyo.singleton({
name: "preware.PackagesModel",
assistant: !1,
onlyLoad: !1,
multiPkg: !1,
multiPkgs: !1,
doMyApps: !1,
loaded: !1,
packages: [],
packagesReversed: {},
categories: [],
feeds: [],
urls: [],
types: [],
unknown: [],
savedDB: !1,
hasPrices: !1,
dirtyFeeds: !1,
soiledPackages: !1,
stagedPkgs: !1,
subscription: !1,
rawData: "",
unknownCount: 0,
unknownFixed: 0,
displayStatus: function(e) {
var t = "";
e.error === !0 && (t = "ERROR: "), e.msg !== undefined && (t += e.msg), e.progress === !0 && (t += " - Progress: " + e.progValue), enyo.Signals.send("onPackagesStatusUpdate", {
message: t
});
},
doneUpdating: function() {
enyo.Signals.send("onPackagesLoadFinished", {});
},
loadFeeds: function(e, t) {
var n;
try {
this.loaded = !1, this.packages = [], this.packagesReversed = {}, this.hasPrices = !1, this.feeds = [], this.urls = [];
for (n = 0; n < e.length; n += 1) this.feeds.push(e[n].name), this.urls.push(e[n].url);
this.onlyLoad = t, this.displayStatus({
message: $L("<strong>Loading Package Information</strong>"),
progress: !0,
progValue: 0
}), this.infoStatusRequest();
} catch (r) {
enyo.error("packagesModel#loadFeeds", r);
}
},
infoStatusRequest: function() {
this.displayStatus({
message: $L("<strong>Loading Package Information</strong><br>Status"),
progress: !0,
progValue: Math.round(1 / (this.feeds.length + 1) * 100)
}), this.subscription = preware.IPKGService.getStatusFile(this.infoResponse.bind(this, -1));
},
infoListRequest: function(e) {
this.displayStatus({
message: $L("<strong>Loading Package Information</strong><br>") + this.feeds[e],
progress: !0,
progValue: Math.round((e + 2) / (this.feeds.length + 1) * 100)
}), this.feedNum += 1, this.subscription = preware.IPKGService.getListFile(this.infoResponse.bind(this, e), this.feeds[e]);
},
infoResponse: function(e, t) {
var n = !1, r;
try {
if (!t || t.errorCode !== undefined) {
if (t.errorText === "org.webosinternals.ipkgservice is not running.") {
this.displayStatus({
error: !0,
message: $L("The Package Manager Service is not running. Did you remember to install it? If you did, first try restarting Preware, then try rebooting your device and not launching Preware until you have a stable network connection available.")
}), this.doneUpdating();
return;
}
n = !0;
}
t.stage ? t.stage === "start" ? this.rawData = "" : t.stage === "middle" ? t.contents && (this.rawData += t.contents, r = this.rawData.lastIndexOf("\n\n"), r !== -1 && (this.parsePackages(this.rawData.substr(0, r), this.urls[e]), this.rawData = this.rawData.substr(r))) : t.stage === "end" && (this.rawData !== "" && this.parsePackages(this.rawData, this.urls[e]), n = !0) : (t.contents && this.parsePackages(t.contents, this.urls[e]), n = !0);
} catch (i) {
enyo.error("packagesModel#infoResponse", i);
}
n && (this.feeds[e + 1] ? this.infoListRequest(e + 1) : (this.displayStatus({
message: $L("<strong>Done Loading!</strong>"),
progress: !1,
progValue: 0
}), preware.PrefCookie.get().fixUnknown ? this.fixUnknown() : this.loadSaved()));
},
parsePackages: function(e, t) {
var n, r, i, s, o;
try {
if (e) {
n = e.split(/\n/), r = new RegExp(/[\s]*([^:]*):[\s]*(.*)[\s]*$/), i = !1;
for (s = 0; s < n.length; s += 1) o = r.exec(n[s]), o ? (o[1] === "Package" && !i && (i = {
Size: 0,
Status: "",
Architecture: "",
Section: "",
Package: "",
Filename: "",
Depends: "",
Maintainer: "",
Version: "",
Description: "",
MD5Sum: "",
"Installed-Time": 0,
"Installed-Size": 0,
Source: ""
}), o[1] && o[2] && (i[o[1]] = o[2])) : i && (this.loadPackage(i, t), i = !1);
i && (this.loadPackage(i, t), i = !1);
}
} catch (u) {
enyo.error("packagesModel#parsePackages", u);
}
},
loadPackage: function(e, t) {
var n, r, i;
if (e.Status && (e.Status.include("not-installed") || e.Status.include("deinstall"))) return;
this.deviceVersion || (device.version.indexOf(" ") >= 0 ? this.deviceVersion = device.version.substring(0, device.version.indexOf(" ")) : this.deviceVersion = device.version), n = new preware.PackageModel(e);
if (this.deviceVersion && this.deviceVersion.match(/^[0-9:.\-]+$/)) {
if (this.versionNewer(this.deviceVersion, n.minWebOSVersion)) return;
if (this.versionNewer(n.maxWebOSVersion, this.deviceVersion)) return;
} else enyo.error("Could not get OS version, so packges did not get filtered.");
if (!preware.PrefCookie.get().ignoreDevices && n.devices && n.devices.length > 0 && n.devices.indexOf(device.name) == -1) {
enyo.error("Ignoring package because of wrong device name...");
return;
}
if (preware.PrefCookie.get().onlyShowFree && n.price !== undefined && n.price !== "0" && n.price !== "0.00") return;
if (preware.PrefCookie.get().onlyShowEnglish && n.languages && n.languages.length && !n.inLanguage("en")) return;
return !n.location && n.filename && t && (n.location = t + "/" + n.filename), r = this.packageInList(n.pkg), r === !1 ? (this.packages.push(n), this.packagesReversed[n.pkg] = this.packages.length, n) : (i = this.packages[r].infoUpdate(n), i ? (this.packages[r] = i, i) : n);
},
fixUnknown: function() {
this.unknownCount = 0, this.unknownFixed = 0, this.unknown = [];
var e;
if (this.packages.length > 0) {
for (e = 0; e < this.packages.length; e += 1) if (this.packages[e].title === "This is a webOS application." || this.packages[e].type === "Unknown") this.unknown[this.unknownCount] = e, this.unknownCount += 1;
this.unknownCount > 0 ? (this.displayStatus({
message: $L("<strong>Scanning Unknown Packages</strong><br />") + this.packages[this.unknown[0]].pkg.substr(-32),
progress: !0,
progValue: 0
}), this.packages[this.unknown[0]].loadAppinfoFile(this.fixUnknownDone.bind(this))) : this.loadSaved();
} else this.loadSaved();
},
fixUnknownDone: function() {
this.unknownFixed += 1, this.unknownFixed === this.unknownCount ? (this.displayStatus({
message: $L("<strong>Done Fixing!</strong>"),
progress: !1,
progValue: 0
}), this.loadSaved()) : (this.displayStatus({
message: $L("<strong>Scanning Unknown Packages</strong><br />") + this.packages[this.unknown[this.unknownFixed]].pkg.substr(-32),
progValue: Math.round(this.unknownFixed / this.unknownCount * 100),
progress: !0
}), this.packages[this.unknown[this.unknownFixed]].loadAppinfoFile(this.fixUnknownDone.bind(this)));
},
loadSaved: function() {
preware.SavedPacketlist.load(this.doneLoading.bind(this));
},
doneLoading: function() {
var e, t, n, r, i, s;
try {
this.dirtyFeeds = !1, this.soiledPackages = !1, this.loaded = !0, this.packagesReversed = {}, this.categories = [], this.feeds = [], this.rawData = "";
if (this.packages.length > 0) {
this.packages.sort(function(e, t) {
var n, r;
return e.title && t.title ? (n = e.title.toLowerCase(), r = t.title.toLowerCase(), n < r ? -1 : n > r ? 1 : 0) : -1;
});
for (e = 0; e < this.packages.length; e += 1) this.packagesReversed[this.packages[e].pkg] = e + 1;
}
for (e = 0; e < this.packages.length; e += 1) {
this.categories.indexOf(this.packages[e].category) === -1 && this.categories.push(this.packages[e].category);
for (t = 0; t < this.packages[e].feeds.length; t += 1) this.feeds.indexOf(this.packages[e].feeds[t]) === -1 && this.feeds.push(this.packages[e].feeds[t]);
this.types.indexOf(this.packages[e].type) === -1 && this.types.push(this.packages[e].type);
}
} catch (o) {
enyo.error("packagesModel#doneLoading", o);
}
i = function(e, t) {
var n, r;
return e && t ? (n = e.toLowerCase(), r = t.toLowerCase(), n < r ? -1 : n > r ? 1 : 0) : -1;
}, this.categories.length > 0 && this.categories.sort(i), this.feeds.length > 0 && this.feeds.sort(i), this.types.length > 0 && this.types.sort(i);
if (this.onlyLoad === !1) {
r = [];
for (n = 0; n < this.packages.length; n += 1) this.packages[n].blacklisted === !1 && r.push({
_kind: "org.webosinternals.preware.justType:1",
id: this.packages[n].pkg,
display: this.packages[n].title,
secondary: this.packages[n].type + " - " + this.packages[n].category
});
preware.db8Storage.deleteAll(function() {
preware.db8Storage.putArray(r);
});
}
this.doneUpdating();
},
versionNewer: function(e, t) {
if (!e) return !0;
if (!t) return !1;
var n = e.split(":"), r = t.split(":"), i = n[n.length > 1 ? 1 : 0].split("."), s = r[r.length > 1 ? 1 : 0].split("."), o, u, a, f, l = [], c = [], h, p, d;
if (n.length > 1 || r.length > 1) {
a = n.length > 1 ? parseInt(n[0], 10) : 0, f = r.length > 1 ? parseInt(r[0], 10) : 0, o = f - a;
if (o !== 0) return o > 0 ? !0 : !1;
}
h = i.length > s.length ? i.length : s.length;
for (u = 0; u < h; u += 1) l[u] = i.length > u ? parseInt(i[u], 10) : 0, c[u] = s.length > u ? parseInt(s[u], 10) : 0;
p = i.length > 0 ? i[i.length - 1].split("-") : [], d = s.length > 0 ? s[s.length - 1].split("-") : [];
if (p.length > 1 || d.length > 1) h += 1, l[u] = p.length > 1 ? parseInt(p[1], 10) : 0, c[u] = d.length > 1 ? parseInt(d[1], 10) : 0;
for (u = 0; u < h; u += 1) {
o = c[u] - l[u];
if (o !== 0) return o > 0 ? !0 : !1;
}
return !1;
},
packageInList: function(e) {
var t = this.packagesReversed[e];
return t !== undefined ? t - 1 : !1;
}
});

// palmProfile.js

enyo.singleton({
name: "preware.PalmProfile",
palmProfile: !1,
callback: !1,
getPalmProfile: function(e, t) {
this.callback = e, this.palmProfile && !t ? this.doPalmProfileReady({
success: !0,
palmProfile: this.palmProfile,
message: ""
}) : (this.palmProfile = !1, preware.IPKGService.impersonate(this._gotPalmProfile.bind(this), "com.palm.configurator", "com.palm.db", "get", {
ids: [ "com.palm.palmprofile.token" ]
}));
},
_gotPalmProfile: function(e) {
e.returnValue === !0 && (this.palmProfile = e.results[0]), this.doPalmProfileReady({
success: e.returnValue,
palmProfile: this.palmProfile,
message: ""
});
},
doPalmProfileReady: function(e) {
this.callback && this.callback(null, e);
}
});

// savedPacketlist.js

enyo.singleton({
name: "preware.SavedPacketlist",
load: function(e) {
enyo.error("preware.SavedPacketlist.load is only a stub."), e && e({
success: !1
});
},
save: function(e) {
enyo.error("preware.SavedPacketlist.save is only a stub"), e && e({
success: !1
});
}
});

// typeConditions.js

enyo.singleton({
name: "preware.typeConditions",
Application: {
launch: !0,
update: !0,
showScreenshots: !0,
showDependents: !0
},
Service: {
update: !0,
showDependents: !0
},
Plugin: {
update: !0,
showDependents: !0
},
Kernel: {
update: !0,
updateAsReplace: !0,
showDependents: !0
},
"Kernel Module": {
update: !0,
updateAsReplace: !0,
showDependents: !0
},
Patch: {
update: !0,
updateAsReplace: !0,
showScreenshots: !0,
showDependents: !0
},
Font: {
update: !0,
updateAsReplace: !0,
showScreenshots: !0,
showDependents: !0
},
Theme: {
update: !0,
updateAsReplace: !0,
showScreenshots: !0
},
Feed: {
update: !0
},
Optware: {
update: !0,
showDependents: !0
},
"Linux Application": {
update: !0,
showDependents: !0
},
"Linux Daemon": {
update: !0,
showDependents: !0
},
"System Utilities": {
update: !0,
showDependents: !0
},
"OS Application": {
update: !0,
updateAsReplace: !0,
showDependents: !0
},
"OS Daemon": {
update: !0,
updateAsReplace: !0,
showDependents: !0
},
Unknown: {},
Package: {},
can: function(e, t) {
return preware.typeConditions[e] ? preware.typeConditions[e][t] ? !0 : !1 : preware.typeConditions.Unknown[t] ? !0 : !1;
}
});

// globals.js

String.prototype.include = function(e) {
return this.indexOf(e) > -1;
}, enyo.singleton({
name: "preware.Globals",
published: {
appVersion: "0.2"
}
});

// utility.js

formatDate = function(e) {
var t = "";
if (e) {
var n = new Date(e * 1e3), r = !1;
t += n.getMonth() + 1 + "/" + n.getDate() + "/" + String(n.getFullYear()).substring(2) + " ", n.getHours() > 12 && (r = !0), r ? (t += n.getHours() - 12 + ":", n.getMinutes() < 10 && (t += "0"), t += n.getMinutes() + " PM") : (n.getHours() < 1 && (t += "12"), n.getHours() > 0 && (t += n.getHours()), t += ":", n.getMinutes() < 10 && (t += "0"), t += n.getMinutes() + " AM");
}
return t;
}, formatSize = function(e) {
var t = e + $L(" B"), n = e;
return n > 1024 && (n = Math.round(n / 1024 * 100) / 100, t = n + $L(" KB")), n > 1024 && (n = Math.round(n / 1024 * 100) / 100, t = n + $L(" MB")), t;
}, getDomain = function(e) {
var t = new RegExp("^(?:http(?:s)?://)?([^/]+)"), n = e.match(t);
if (n) {
var r = n[1].replace(/www./, "");
return r;
}
return "Link";
}, removeAuth = function(e) {
return e.replace(new RegExp("http://[^@/]+@", "gm"), "http://").replace(new RegExp("https://[^@/]+@", "gm"), "https://").replace(new RegExp('-H "Device-Id: [^"]+" ', "gm"), "").replace(new RegExp('-H "Auth-Token: [^"]+" ', "gm"), "");
}, trim = function(e) {
return e.replace(/^\s*/, "").replace(/\s*$/, "");
}, isNumeric = function(e) {
return isNaN(parseFloat(e)) ? !1 : !0;
};
