import { jest } from '@jest/globals';
import { Ncore } from './index';

describe('Ncore checkLoginExpiration', () => {
	let ncore: Ncore;

	beforeEach(() => {
		ncore = new Ncore({
			username: 'username',
			password: 'password',
			url: 'url',
		});
	});

	it('should log in if there are no cookies', async () => {
		const loginMock = jest.fn<() => Promise<void>>();
		ncore.login = loginMock;
		await ncore.checkLoginExpiration();
		expect(loginMock).toHaveBeenCalled();
	});

	it('should not log in if there are cookies and none are expired', async () => {
		ncore.cookies.add('value1; expires=Fri, 31 Dec 9999 23:59:59 GMT');
		ncore.cookies.add('value2; expires=Fri, 31 Dec 9999 23:59:59 GMT');
		const loginMock = jest.fn<() => Promise<void>>();
		ncore.login = loginMock;
		await ncore.checkLoginExpiration();
		expect(loginMock).not.toHaveBeenCalled();
	});

	it('should log in if there are cookies and at least one is expired', async () => {
		ncore.cookies.add('value1; expires=Fri, 31 Dec 9999 23:59:59 GMT');
		ncore.cookies.add('value2; expires=Fri, 31 Dec 2021 23:59:59 GMT');
		const loginMock = jest.fn<() => Promise<void>>();
		ncore.login = loginMock;
		await ncore.checkLoginExpiration();
		expect(loginMock).toHaveBeenCalled();
	});
});
