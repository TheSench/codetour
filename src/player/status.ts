import { reaction } from "mobx";
import * as vscode from "vscode";
import { EXTENSION_NAME } from "../constants";
import { store } from "../store";

function createCurrentTourItem() {
  const currentTourItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  currentTourItem.command = `${EXTENSION_NAME}.resumeTour`;
  currentTourItem.color = new vscode.ThemeColor(
    "statusBarItem.prominentForeground"
  );

  currentTourItem.show();
  return currentTourItem;
}

let currentTourItem: vscode.StatusBarItem | null = null;
export function registerStatusBar() {
  reaction(
    // @ts-ignore
    () => [
      store.activeTour
        ? [
            store.activeTour.step,
            store.activeTour.tour.title,
            store.activeTour.tour.steps.length
          ]
        : null,
      store.isRecording
    ],
    () => {
      if (store.activeTour) {
        if (!currentTourItem) {
          currentTourItem = createCurrentTourItem();
        }

        const prefix = store.isRecording ? "Recording " : "";
        currentTourItem.text = `${prefix}CodeTour: #${
          store.activeTour.step + 1
        } of ${store.activeTour.tour.steps.length} (${
          store.activeTour.tour.title
        })`;
      } else {
        if (currentTourItem) {
          currentTourItem.dispose();
          currentTourItem = null;
        }
      }
    }
  );
}
