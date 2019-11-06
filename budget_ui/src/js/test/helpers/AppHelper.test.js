import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import * as AppHelper from "../../helpers/AppHelper"

describe('AppHelper', () => {
    describe('createUserIfNecessary', () => {
        it('should not execute if NOT allowCreateUserCheck', () => {
            let allowCreateUserCheck = false;
            let SetAllowCreateUserCheck = jest.fn();
            AppHelper.createUserIfNecessary(allowCreateUserCheck, {userName: 'test'}, SetAllowCreateUserCheck, () => {
            });
            expect(SetAllowCreateUserCheck.mock.calls.length).toBe(0);
        });

        it('should not execute if NOT user', () => {
            let user = null;
            let SetAllowCreateUserCheck = jest.fn();
            AppHelper.createUserIfNecessary(true, user, SetAllowCreateUserCheck, () => {
            });
            expect(SetAllowCreateUserCheck.mock.calls.length).toBe(0);
        });

        it('should execute if allowCreateUserCheck and User', () => {
            let SetAllowCreateUserCheck = jest.fn();
            AppHelper.createUserIfNecessary(true, {userName: 'test'}, SetAllowCreateUserCheck, () => {
            });
            expect(SetAllowCreateUserCheck.mock.calls.length).toBe(1);
        });

        it('should call user/create and then update data with last viewed date and set allowDateLookup/allowDateLookup to false/true', () => {
            let mock = new MockAdapter(axios);
            mock.onGet('/users').reply(200, {data: {last_viewed: '01/01/2020'}});
            let allowCreateUserCheck = true;
            let allowDateLookup = false;
            let user = {userName: 'test'};
            let SetAllowCreateUserCheck = (x) => {
                allowCreateUserCheck = x
            };
            let SetAllowDateLookup = (x) => {
                allowDateLookup = x
            };

            AppHelper.createUserIfNecessary(allowCreateUserCheck, user, SetAllowCreateUserCheck, SetAllowDateLookup);
            expect(allowCreateUserCheck).toBe(false);
            expect(allowDateLookup).toBe(true);
        })
    })
});
