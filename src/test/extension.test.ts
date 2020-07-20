// Run via "Extension Tests" launch config

import * as assert from "assert";
import * as extension from '../extension';
import * as path from 'path';
import {
  Range,
  SelectionRange,
  TextDocument,
  Uri,
  window,
  workspace,
  Position
} from 'vscode';

const resourcesDir = '../../../src/test/resources/';

var document: TextDocument;

before(async function () {
  const uri = Uri.file(
    path.join(__dirname + resourcesDir + 'test.md')
  );
  document = await workspace.openTextDocument(uri);
  await window.showTextDocument(document);
  await sleep(500);
});

describe("Markdown selection", function () {

  describe("Line properties", function () {

    it("An empty line is blank", function () {
      assert(extension.lineIsBlank(document, 1));
    });

    it("A non-empty line is not blank", function () {
      assert(!extension.lineIsBlank(document, 2));
    });

    it("A whitespace-only line is blank", function () {
      assert(extension.lineIsBlank(document, 8));
    });

    it("A level 1 heading is a heading", function () {
      assert(extension.lineIsHeading(document, 0));
    });

    it("A level 2 heading is a heading", function () {
      assert(extension.lineIsHeading(document, 4));
    });

    it("A level 3 heading is a heading", function () {
      assert(extension.lineIsHeading(document, 17));
    });

  });

  describe("Line levels", function () {

    it("A level 1 heading is at level 1", function () {
      assert.equal(extension.levelOf(document, 0), 1);
    });

    it("A level 2 heading is at level 2", function () {
      assert.equal(extension.levelOf(document, 4), 2);
    });

    it("A level 3 heading is at level 3", function () {
      assert.equal(extension.levelOf(document, 17), 3);
    });

    it("A non-heading is at level 1000", function () {
      assert.equal(extension.levelOf(document, 12), 1000);
    });

    it("A level 1 heading is at least at level 1", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(1)(document, 0));
    });

    it("A level 1 heading is at least at level 2", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(2)(document, 0));
    });

    it("A level 1 heading is at least at level 3", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(3)(document, 0));
    });

    it("A level 2 heading is at least at level 2", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(2)(document, 4));
    });

    it("A level 2 heading is at least at level 3", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(3)(document, 4));
    });

    it("A level 3 heading is at least at level 3", function () {
      assert(extension.lineIsHeadingAtLevelOrHigher(3)(document, 17));
    });

  });

  describe("Lines before or after", function () {

    it("Blank line before heading is previous line", function () {
      assert.equal(extension.lineBeforeUntil(document, 4, extension.lineIsBlank), 3);
    });

    it("Blank line before first line of paragraph is previous line", function () {
      assert.equal(extension.lineBeforeUntil(document, 6, extension.lineIsBlank), 5);
    });

    it("Blank line before inner line of paragraph is line before paragraph", function () {
      assert.equal(extension.lineBeforeUntil(document, 14, extension.lineIsBlank), 12);
    });

    it("Blank line after heading is next line", function () {
      assert.equal(extension.lineAfterUntil(document, 4, extension.lineIsBlank), 5);
    });

    it("Blank line after last line of paragraph is next line", function () {
      assert.equal(extension.lineAfterUntil(document, 7, extension.lineIsBlank), 8);
    });

    it("Blank line after inner line of paragraph is line after paragraph", function () {
      assert.equal(extension.lineAfterUntil(document, 14, extension.lineIsBlank), 16);
    });

  });

  describe("Line ranges", function () {

    it("Line range, no parent", function () {
      const range = extension.lineRange(3, 6);
      assert.deepEqual(
        range,
        new SelectionRange(new Range(3, 0, 6, 0), undefined)
      );
    });

    it("Line range, no parent", function () {
      const parent = new SelectionRange(new Range(0, 0, 6, 0));
      const range = extension.lineRange(1, 4, parent);
      assert.deepEqual(
        range,
        new SelectionRange(new Range(1, 0, 4, 0), parent)
      );
    });

  });

  describe("Paragraph ranges", function () {

    const result0 = new SelectionRange(new Range(3, 0, 5, 0));

    it("Header line, start of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(4, 0)),
        result0
      );
    });

    it("Header line, middle of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(4, 2)),
        result0
      );
    });

    it("Header line, end of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(4, 4)),
        result0
      );
    });

    const result1 = new SelectionRange(new Range(1, 0, 3, 0));

    it("Single line paragraph, start of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(2, 0)),
        result1
      );
    });

    it("Single line paragraph, middle of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(2, 3)),
        result1
      );
    });

    it("Single line paragraph, end of line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(2, 6)),
        result1
      );
    });

    const result2 = new SelectionRange(new Range(12, 0, 16, 0));

    it("Multi-line paragraph, start of first line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(13, 0)),
        result2
      );
    });

    it("Multi-line paragraph, middle of first line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(13, 3)),
        result2
      );
    });

    it("Multi-line paragraph, end of first line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(13, 6)),
        result2
      );
    });

    it("Multi-line paragraph, start of middle line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(14, 0)),
        result2
      );
    });

    it("Multi-line paragraph, middle of middle line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(14, 10)),
        result2
      );
    });

    it("Multi-line paragraph, end of middle line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(14, 26)),
        result2
      );
    });

    it("Multi-line paragraph, start of last line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(15, 0)),
        result2
      );
    });

    it("Multi-line paragraph, middle of last line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(15, 8)),
        result2
      );
    });

    it("Multi-line paragraph, end of last line", function () {
      assert.deepEqual(
        extension.paragraphRange(document, new Position(15, 15)),
        result2
      );
    });

  });

  describe("Section ranges", function () {

    const result0 =
      new SelectionRange(new Range(0, 0, 28, 0));

    it("Level 1 section, heading", function () {
      assert.deepEqual(
        extension.sectionRange(document, 0),
        result0
      );
    });

    it("Level 1 section, inside non-blank", function () {
      assert.deepEqual(
        extension.sectionRange(document, 2),
        result0
      );
    });

    it("Level 1 section, inside blank", function () {
      assert.deepEqual(
        extension.sectionRange(document, 3),
        result0
      );
    });

    const result1 =
      new SelectionRange(new Range(3, 0, 20, 0),
        result0
      );

    it("Level 2 section as first sub-section, heading", function () {
      assert.deepEqual(
        extension.sectionRange(document, 4),
        result1
      );
    });

    it("Level 2 section as first sub-section, inside blank", function () {
      assert.deepEqual(
        extension.sectionRange(document, 6),
        result1
      );
    });

    it("Level 2 section as first sub-section, inside", function () {
      assert.deepEqual(
        extension.sectionRange(document, 7),
        result1
      );
    });

    it("Level 2 section as first sub-section, inside blank inner", function () {
      assert.deepEqual(
        extension.sectionRange(document, 8),
        result1
      );
    });

    it("Level 2 section as first sub-section, inside later", function () {
      assert.deepEqual(
        extension.sectionRange(document, 9),
        result1
      );
    });

    const result2 =
      new SelectionRange(new Range(20, 0, 28, 0),
        result0
      );

    it("Level 2 section as second sub-section", function () {
      assert.deepEqual(
        extension.sectionRange(document, 23),
        result2
      );
    });

    it("Level 2 section as second sub-section blank", function () {
      assert.deepEqual(
        extension.sectionRange(document, 24),
        result2
      );
    });

    const result3 =
      new SelectionRange(new Range(10, 0, 16, 0),
        result1
      );

    it("Level 3 section as first sub-section", function () {
      assert.deepEqual(
        extension.sectionRange(document, 15),
        result3
      );
    });

    const result4 =
      new SelectionRange(new Range(16, 0, 20, 0),
        result1
      );

    it("Level 3 section as second sub-section", function () {
      assert.deepEqual(
        extension.sectionRange(document, 19),
        result4
      );
    });

    const result5 =
      new SelectionRange(new Range(24, 0, 28, 0),
        result2
      );

    it("Level 3 section in second level 2 section blank", function () {
      assert.deepEqual(
        extension.sectionRange(document, 26),
        result5
      );
    });

    it("Level 3 section in second level 2 section", function () {
      assert.deepEqual(
        extension.sectionRange(document, 27),
        result5
      );
    });

  });

});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
