const { expect } = require('chai');
const { test } = require('../browser');

describe('Moonlet - Web 1920 x 1080', () => {

	const pwidth = 1920;
	const pheight = 1080;
	let page;
	before( test( async(browser, opts) => {
		page = await browser.newPage();
		await page.setViewport({ width: pwidth, height: pheight });
	}));

	describe('Landing page', async () => {

		const slug = 'create-wallet-page';

		before( test( async(browser, opts) => {
			await page.goto(`${opts.appUrl}`);
			await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-' + slug + '.png' });
		}));

		it('should have a title', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'h1.title' );
			expect(innerText).to.be.equal('Moonlet');
		}));

		it('should have a "Create new wallet" button', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'button.create-wallet span' );
			expect(innerText).to.be.equal('Create new wallet'.toUpperCase());
		}));

		it('should have a "Restore existing wallet" button', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'button.restore-wallet span' );
			expect(innerText).to.be.equal('Restore existing wallet'.toUpperCase());
		}));

	});

	describe('Create Wallet page', async () => {

		let words = [];

		before( test( async(browser, opts) => {
			await page.goto(`${opts.appUrl}`);

			await page.addScriptTag({ url: 'https://code.jquery.com/jquery-1.11.0.min.js' });

			// click on create new wallet button
			await page.click('button.create-wallet');

			await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-1-start.png' });
		}));

		it('should have the proper header section title of "Create New Wallet"', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'header section > span.title' );
			expect(innerText).to.be.equal('Create New Wallet');
		}));

		it('should be on step 1 of the wallet creation', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'div.create-wallet-step1 h5' );
			expect(innerText).to.be.equal('Backup Secret Phrase');
		}));

		it('should have a "Reveal Secret Phrase" button', test(async (browser, opts) => {
			const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'div.word-list-overlay button span' );
			expect(innerText).to.be.equal('Reveal Secret Phrase'.toUpperCase());
		}));

		describe('1 - Click on "Reveal Secret Phrase"', async () => {
			before( test( async(browser, opts) => {
				// click on create new wallet button
				await page.click('div.word-list-overlay button');
	
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-2-click-reveal-button.png' });
			}));

			it('should reveal 12 seed words', test(async (browser, opts) => {

				const elements = await page.evaluate(() => {
					const $ = window.$; //otherwise the transpiler will rename it and won't work

					const found = [];
					$('div.mdc-chip__text').each( function(e) {
						found.push( $(this).text() );
					});

					return found;
				});
				words = elements;
				expect(words.length).to.be.equal(12);
			}));

			it('should have a "Confirm Backup" button', test(async (browser, opts) => {
				const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'div.create-wallet-step1 > button span' );
				expect(innerText).to.be.equal('Confirm Backup'.toUpperCase());
			}));

		});

		describe('2 - Click on "Confirm Backup" button', async () => {
			before( test( async(browser, opts) => {
				// click on create new wallet button
				await page.click('div.create-wallet-step1 > button');
	
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-3-0-click-confirm-backup-button.png' });
			}));

			it('should raise an alert "Re-confirm Backup"', test(async (browser, opts) => {
				const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'h2.mdc-dialog__header__title span' );
				expect(innerText).to.be.equal('Re-confirm Backup');
			}));

		});


		describe('3 a - Re-confirm Backup - Click on "NO" button', async () => {
			before( test( async(browser, opts) => {
				// click on create new wallet button
				await page.click('.mdc-dialog .mdc-dialog__footer__button--cancel');
	
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-3-1-a-click-re-confirm-backup-NO-button.png' });
			}));

			it('should hide the alert', test(async (browser, opts) => {
				const found = await page.evaluate(() => {
					const $ = window.$;
					return $('.mdc-dialog').hasClass('mdc-dialog--open');
				});
				expect(found).to.be.false;
			}));

		});

		describe('3 b - Re-confirm Backup - Click on "YES" button', async () => {
			before( test( async(browser, opts) => {

				await page.click('div.create-wallet-step1 > button');
				await page.click('.mdc-dialog .mdc-dialog__footer__button--accept');
	
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-3-2-b-click-re-confirm-backup-YES-button.png' });
			}));

			it('should be on step 2 of the wallet creation', test(async (browser, opts) => {
				const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'div.create-wallet-step2 h5' );
				expect(innerText).to.be.equal('Validate Secret Phrase');
			}));

		});

		describe('4 - Validate Secret Phrase', async () => {
			before( test( async(browser, opts) => {
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-4-validate-words.png' });
			}));

			it('validation should present the same words as before', test(async (browser, opts) => {
	
				const evaluation = await page.evaluate((savedWords) => {
					const $ = window.$;
					
					let found = 0;
					$('.shuffled-words div.mdc-chip__text').each( function(e) {
						if ( savedWords.indexOf( $(this).text() ) >= 0 ) {
							found++;
						}
					});

					if (found === savedWords.length) {
						return true;
					}

					return false;
				}, words);

				expect(evaluation).to.be.true;
			}));

			it('clicking words at random should raise an error', test(async (browser, opts) => {
	
				// click on words in the order they are displayed
				await page.evaluate(() => {
					const $ = window.$;
					$('.shuffled-words div.mdc-chip__text').each( function(e) {
						$(this).parent().click();
					});
				});

				// read the selected words and make sure we have 12
				const elements = await page.evaluate(() => {
					const $ = window.$;

					const found = [];
					$('.selected-words div.mdc-chip__text').each( function(e) {
						found.push( $(this).text() );
					});

					return found;
				});
				expect(elements.length).to.be.equal(12);

				const found = await page.evaluate(() => {
					const $ = window.$;
					return $('div.create-wallet-step2 > span').hasClass('error');
				});
				expect(found).to.be.true;

				// clear words in .selected-words
				await page.evaluate(() => {
					const $ = window.$;
					$('.selected-words div.mdc-chip__text').each( function() {
						$(this).parent().click();
					});
				});
			}));

			it('clicking words in the correct order shoule enable the "Validate Secret Phrase" button', test(async (browser, opts) => {
	
				// click on words in the order they were saved
				await page.evaluate((savedWords) => {
					const $ = window.$;

					for ( let i = 0; i < savedWords.length; i++ ) {
						const thisWord = savedWords[i];
						const span = $("div:contains('"+thisWord+"')");
						span.parent().click();
					}

				}, words);

				// read the selected words and make sure we have 12
				const elements = await page.evaluate(() => {
					const $ = window.$;

					const found = [];
					$('.selected-words div.mdc-chip__text').each( function(e) {
						found.push( $(this).text() );
					});

					return found;
				});
				expect(elements.length).to.be.equal(12);

				
				const evaluation = await page.evaluate(() => {
					const $ = window.$;
					return $('.create-wallet-step2 .cta-button').prop('disabled');
				});
				expect(evaluation).to.be.false;
			}));

		});

		describe('5 - Click on "Validate Secret Phrase" button', async () => {
			before( test( async(browser, opts) => {
				await page.click('.create-wallet-step2 .cta-button');
				await page.screenshot({ path: 'e2eoutput/' + pwidth + 'x' + pheight + '-create-wallet-page-5-setup-password.png' });
			}));

			it('should be on step 3 of the wallet creation', test(async (browser, opts) => {
				const innerText = await page.evaluate( (sel) => document.querySelector(sel).innerText, 'div.create-wallet-step3 h5' );
				expect(innerText).to.be.equal('Create Password');
			}));
		});

	});
});