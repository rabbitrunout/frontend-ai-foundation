# FE-05 Accessible Component Notes

## Components Built by Hand

I first implemented three interactive React + TypeScript components without a component library:

- Modal dialog
- Tabs
- Disclosure

I tested the components using keyboard-only interaction.

### Manual keyboard behavior

#### Disclosure
- Tab moves focus to the disclosure button.
- Enter toggles the disclosure.
- Space toggles the disclosure.
- `aria-expanded` reflects the current state.
- `aria-controls` connects the button to the revealed content.

#### Tabs
- Tab moves focus into the tab list.
- ArrowRight moves to the next tab.
- ArrowLeft moves to the previous tab.
- Home moves to the first tab.
- End moves to the last tab.
- Only the active tab is in the normal tab sequence.
- Each tab uses `role="tab"` and is connected to its `tabpanel`.

#### Modal
- Focus moves into the dialog when it opens.
- Tab and Shift+Tab are trapped inside the dialog.
- Escape closes the dialog.
- Focus returns to the trigger after the dialog closes.
- The dialog uses `role="dialog"` and `aria-modal="true"`.

---

# Comparison with shadcn/ui

After implementing the components manually, I installed shadcn/ui using its Radix UI implementation and reviewed the generated `dialog.tsx` and `tabs.tsx` source.

## Gap 1: Dialog behavior is delegated to accessibility primitives

My modal implements focus trapping, Escape handling, initial focus, and focus restoration manually.

For example, I query focusable elements myself and manually loop focus from the last element back to the first.

shadcn instead builds the component from Radix Dialog primitives:

- `DialogPrimitive.Root`
- `DialogPrimitive.Trigger`
- `DialogPrimitive.Content`
- `DialogPrimitive.Close`
- `DialogPrimitive.Portal`
- `DialogPrimitive.Overlay`

This means the accessibility behavior is encapsulated in tested dialog primitives rather than being reimplemented inside every application component.

My implementation works for the current example, but it is easier to miss edge cases when managing focus manually.

## Gap 2: My dialog did not provide a dedicated accessible description

My implementation connects the dialog heading with `aria-labelledby`, but I did not create a separate dialog description relationship.

shadcn provides:

- `DialogTitle`
- `DialogDescription`

The generated source exposes `DialogPrimitive.Description`, making it possible to provide a structured accessible description in addition to the dialog title.

This is more complete than relying only on the visible heading and arbitrary children content.

## Gap 3: shadcn includes an explicitly labelled close control

My dialog has Cancel and Confirm buttons, but I did not add a dedicated close icon/button.

shadcn creates a close control with:

```tsx
<XIcon />
<span className="sr-only">Close</span>