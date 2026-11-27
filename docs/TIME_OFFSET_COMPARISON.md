# Time Offset 1.4 workflow comparison

The supplied file identifies itself as Time Offset 1.4. This comparison uses its embedded UI strings and identifiers, plus the [author’s version history](https://mysteropodes.gumroad.com/l/CIFGN). It describes FrameFlow’s corresponding workflows. A native run of both products on the same AE project is still needed to compare edge cases and visual output.

| Workflow in the reference | FrameFlow 2.4.9 |
| --- | --- |
| Four directions around the cursor, one-time step, quick ten-frame adjustment | Four direction buttons, Shift-click for a temporary step, Shift-click the step plus/minus buttons for ten frames. The After boundary includes keys at the cursor. Before excludes them. |
| Offset layer markers, separated Position axes and special keys | Layer markers and separated axes participate in verified offsets. A skip rule is available for unsupported properties. |
| Nested retiming, depth entry and precomp hierarchy | Inspect the hierarchy in the current scope and choose the depth, including all levels. Depth 0 retains instance-level editing. Nested offsets preview named sources and affect each shared source once when every instance agrees. |
| Marker-based retiming and reference reset | Pick a marked layer by ID and clear it in the same dialog. Each applicable marker adds one step. The guide stays in place and the rule also applies inside nested sources. Binding lasts for the AE session. |
| Protect and invert key labels, apply labels to selected keys | Protect or include label IDs, populate the filter from the AE selection and assign a label separately. |
| Skip locked, disabled and special properties | Independent skip options for all three. Collisions and unverified writes block the edit. |
| Signed frame counter, reset and reuse | Counter per composition for the current session. Its magnitude can be reused as a step. |
| Time Zoning | Preview a range from the cursor inside the panel. Use its length as a step or explicitly set the native AE work area. |
| KBar commands and step prompt | The same eight named actions via KBar’s Open Extension button. Append `?` for a one-time step. FrameFlow needs to receive the CEP event. |
| Protected source regions | A potentially affected protected source region blocks retiming. FrameFlow preserves the source timing and leaves that edit for an explicit change in AE. |

Marker offsets use FrameFlow’s cumulative boundary model. Exact behavior of marker comments, persistence across launches and native live zoning in the reference was not established from the compiled file. FrameFlow uses marker timestamps, per-session reference binding and explicit work-area Apply. Measurements and arithmetic, shown in the author’s later 1.4.4 notes, are already available in FrameFlow.


## Updates through 1.8.1

| Time Offset change | FrameFlow 2.4.9 |
| --- | --- |
| 1.4.4 measurement and arithmetic | The Time menu measures selected keys, layers and their gaps or overlaps. The step field accepts arithmetic. |
| 1.8 edge and key moves | In/Out + Keys previews the matching edge and key moves. The preview checks for keys that would become hidden by trimming. |
| 1.8 favorite step | Save the current step directly from Time or Settings. |
| 1.8.1 protection during retiming | Source and instance markers are checked before a trim. Choose whether to stop or preserve a protected layer and continue. FrameFlow keeps the existing Stretch and animation timing of skipped layers. |
| 1.8.1 shared sources | Nested edits in FrameFlow deduplicate compatible instances. Incompatible or external uses block changes to the shared source. |

Adobe documents that protected markers copied to instances can diverge from source markers, and that ordinary time-stretching changes layer keyframe positions. See [Responsive Design — Time](https://helpx.adobe.com/after-effects/desktop/motion-graphics/add-responsive-design/responsive-design.html) and [Time-stretching and time-remapping](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/time-stretching-and-time-remapping/time-stretching-time-remapping.html).
