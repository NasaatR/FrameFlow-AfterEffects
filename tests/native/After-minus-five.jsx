/* Run in After Effects via File > Scripts > Run Script File, from the extracted package. */
(function () {
    var installed = File(new File($.fileName).parent.parent.parent.fsName + "/extension/jsx/host.jsx");
    var previousHost = $.global.FrameFlowCEP, previousViewer = app.activeViewer;
    var comp = null, seq = 0, report = [], api, layer, prop, i, before, token, outcome;
    var original = [120,150,168], expected = [120,145,163], values = [20,60,90];
    function run(data) {
        var request = '{"version":"' + api.version + '","id":"native:' + (++seq) + '","data":' + data + '}';
        return api.dispatch(encodeURIComponent(request));
    }
    function expect(condition,message) { if (!condition) throw new Error(message); }
    try {
        expect(installed.exists,"Extract the complete FrameFlow package first.");
        $.evalFile(installed);
        api = $.global.FrameFlowCEP;
        expect(api && api !== previousHost,"FrameFlow host did not load.");
        report.push("FrameFlow " + api.version + " | AE " + app.version + " build " + app.buildNumber);
        comp = app.project.items.addComp("FrameFlow temporary offset check",192,108,1,15,24);
        comp.openInViewer();
        expect(app.project.activeItem === comp,"AE did not activate the temporary composition.");
        layer = comp.layers.addShape();
        prop = layer.property("ADBE Transform Group").property("ADBE Opacity");
        for (i = 0; i < original.length; i++) prop.setValueAtTime(original[i]/24,values[i]);
        comp.time = 141/24;
        before = [layer.startTime,layer.inPoint,layer.outPoint];
        token = /"token":"([A-Za-z0-9.:+-]+)"/.exec(run('{"op":"read"}'));
        expect(token,"The host could not read the temporary composition.");
        outcome = run('{"op":"offset","token":"' + token[1] + '","scope":"all","mode":"offset","region":"after","direction":-1,"frames":5,"compMarkers":false,"mediaPolicy":"skip"}');
        expect(outcome.indexOf('"result":{"ok":true') >= 0,"Offset failed: " + outcome.slice(0,1100));
        expect(prop.numKeys === expected.length,"Key count changed.");
        for (i = 0; i < expected.length; i++) {
            expect(Math.abs(prop.keyTime(i+1)*24-expected[i]) < 0.00001 && prop.keyValue(i+1) === values[i],"Unexpected time or value at key " + (i+1));
        }
        expect(before[0] === layer.startTime && before[1] === layer.inPoint && before[2] === layer.outPoint,"Layer bounds changed.");
        report.push("PASS | CTI 141, After -5 | 120, 150, 168 -> 120, 145, 163. Key values and layer bounds verified.");
    } catch (e) {
        report.push("FAIL | " + e.toString() + " | " + (e.fileName || "") + " line " + (e.line || "?"));
    } finally {
        try { if (comp) comp.remove(); } catch (cleanup) { report.push("Temporary composition cleanup failed: " + cleanup); }
        try { if (previousViewer) previousViewer.setActive(); } catch (viewerClosed) { }
        if (typeof previousHost === "undefined") delete $.global.FrameFlowCEP;
        else $.global.FrameFlowCEP = previousHost;
    }
    alert(report.join("\n"),"FrameFlow offset check");
}());
