import { getMembers } from "../src/scripts/getMembers";
import { assert, expect, test } from 'vitest';

let members = await getMembers();

const expected_members = [
    { team: '', desc: '', name: '✨ andrew ✨' },
    { team: '', desc: '', name: '⭐Kimberley⭐🐮' },
    { team: '', desc: '', name: 'Anna' },
    { team: '1', desc: 'Cool dude', name: 'Anton' },
    { team: '', desc: 'yes', name: 'Becky Pog' },
    { team: '', desc: '', name: 'Chris' },
    { team: '', desc: '', name: 'Emmanuel' },
    { team: '', desc: '', name: 'Owen' },
    { team: '', desc: '', name: 'Yash the mekanic' }
  ]

test("Members exists", () => {
    expect(members).toBeDefined()
})

test("Members contains Anton", () => {
    expect(members).toEqual(expect.arrayContaining([
        expect.objectContaining({ team: '1', desc: 'Cool dude', name: 'Anton' })
    ]));
});

test("Members contains Chris", () => {
    expect(members).toEqual(expect.arrayContaining([
        expect.objectContaining({ team: '', desc: '', name: 'Chris' })
    ]));
});

test("Members has expected output", () => {
    expect(members).toEqual(expected_members)
})