# Direction buttons in KBar

In KBar 3, choose **Add Button → Open Extension**, select **FrameFlow** (extension ID `com.frameflow.ae.panel`), and enter one of the arguments below. Use plain text without quotes. Open a composition and let FrameFlow finish its initial read. If FrameFlow was closed, the first press can open the panel. When the panel shows the composition name, press the button to run the command.

| Action | Current composition | Include nested compositions |
| --- | --- | --- |
| After cursor, later | `OffsetNextPlus` | `OffsetNextPlusComp` |
| After cursor, earlier | `OffsetNextMoins` | `OffsetNextMoinsComp` |
| Before cursor, earlier | `OffsetBeforeMoins` | `OffsetBeforeMoinsComp` |
| Before cursor, later | `OffsetBeforePlus` | `OffsetBeforePlusComp` |

The buttons use FrameFlow’s current frame step, scope, move mode, labels, reference and skip options. A `Comp` button previews the configured nesting depth, or one level if nesting is off. Check the plan and click **Apply Plan**. The other four buttons target the active composition at depth zero.

For a one-time step, append `?` to an argument, for example `OffsetNextMoins?`. In FrameFlow itself, hold **Shift** while clicking a direction. Enter a frame count or arithmetic expression such as `2+3`, preview the change, then apply it. Escape closes the prompt. The saved step stays available for the next use.

The extension listens for `com.frameflow.ae.panel.kbar` while open. Events arriving during an edit or an open dialog are ignored. Close the dialog or let the operation finish before pressing a button again.

[KBar integration guide](https://kraftyfx.github.io/kbar/integration)
