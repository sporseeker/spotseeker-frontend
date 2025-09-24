import { ContentState, convertFromRaw, RawDraftContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

export function draftToHtml(rawContent: RawDraftContentState): string {
  const contentState: ContentState = convertFromRaw(rawContent);
  return stateToHTML(contentState);
}
