describe('Testing Tx-builder safe app', { defaultCommandTimeout: 12000 }, () => {
  const appUrl = Cypress.env('TX_BUILDER_URL')
  const iframeSelector = `iframe[id="iframe-${appUrl}"]`
  const visitUrl = `/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
    'TESTING_SAFE_ADDRESS',
  )}/apps?appUrl=${encodeURIComponent(appUrl)}`

  before(() => {
    cy.task('log', visitUrl)
  })

  beforeEach(() => {
    cy.visitSafeApp(visitUrl, appUrl)

    cy.frameLoaded(iframeSelector)

    cy.findByRole('button', { name: /accept selection/i }).click()
  })

  it('should allow to create and send a simple batch', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x51A099ac1BF46D471110AA8974024Bfe518Fd6C4')
      getBody().find('[name="contractMethodIndex"]').parent().click()
      getBody().findByRole('option', { name: 'testAddressValue' }).click()
      getBody()
        .findByLabelText('newValue (address)')
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })
    cy.findByRole('heading', { name: /transaction builder transaction builder görli/i }).should(
      'be.visible',
    )
    cy.findByRole('button', { name: /transaction details/i }).click()
    cy.findByRole('region').should('exist')
    cy.findByText('test Address Value').should('exist')
    cy.findByText('newValue(address):').should('exist')
    cy.findAllByText('0x49d4...26A6').should('have.length', 2)
  })

  it('should allow to create and send a complex batch', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x51A099ac1BF46D471110AA8974024Bfe518Fd6C4')
      getBody().find('[name="contractMethodIndex"]').parent().click()
      getBody().findByRole('option', { name: 'testBooleanValue' }).click()
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody().find('[name="contractMethodIndex"]').parent().click()
      getBody().findByRole('option', { name: 'testBooleanValue' }).click()
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody().find('[name="contractMethodIndex"]').parent().click()
      getBody().findByRole('option', { name: 'testBooleanValue' }).click()
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })
    cy.findByRole('button', { name: 'Action 1 testBooleanValue' }).click()
    cy.findByRole('button', { name: 'Action 2 testBooleanValue' }).click()
    cy.findByRole('button', { name: 'Action 3 testBooleanValue' }).click()
    cy.findAllByText('newValue(bool):').should('have.length', 3)
    cy.findAllByText('True').should('have.length', 3)
  })

  it('should allow to create and send a batch to an ENS name', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('goerli-safe-test.eth')
      getBody().findByRole('button', { name: 'Use Implementation ABI' }).click()
      getBody()
        .findByLabelText('owner (address)')
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findByLabelText('_threshold (uint256) *').type('1')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })
    cy.findByRole('button', { name: /transaction details/i }).click()
    cy.findByRole('region').should('exist')
    cy.findByText(/add owner with threshold/i).should('exist')
    cy.findByText('owner(address):').should('exist')
    cy.findAllByText('0x49d4...26A6').should('have.length', 2)
    cy.findByText('_threshold(uint256):').should('exist')
  })

  it('should allow to a create and send a batch from an ABI', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/Enter ABI/i)
        .type(
          '[{{}"inputs":[{{}"internalType":"address","name":"_singleton","type":"address"{}}],"stateMutability":"nonpayable","type":"constructor"{}},{{}"stateMutability":"payable","type":"fallback"{}}]',
        )
      getBody()
        .findByLabelText(/to address/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody()
        .findByLabelText(/gor value */i)
        .type('0')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })
    cy.findByRole('heading', { name: /transaction builder transaction builder görli/i }).should(
      'be.visible',
    )
    cy.findByText('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6').should('be.visible')
  })

  it('should allow to create and send a batch using custom data', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody().find('.MuiSwitch-root').click()
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD')
      getBody()
        .findByLabelText(/gor value */i)
        .type('0')
      getBody()
        .findByLabelText(/data */i)
        .type('0x')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })
    cy.findByRole('heading', { name: /transaction builder transaction builder görli/i }).should(
      'be.visible',
    )
    cy.findByText('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD').should('be.visible')
  })

  it('should not allow to create a batch given invalid address', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26AA')
      getBody()
        .findAllByText('The address is not valid')
        .should('have.css', 'color', 'rgb(244, 67, 54)')
    })
  })

  it('should not allow to create a batch given no asset amount', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody().findAllByText('Required').should('have.css', 'color', 'rgb(244, 67, 54)')
    })
  })

  it('should not allow to create a batch given no method data', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody().findAllByText('Required').should('have.css', 'color', 'rgb(244, 67, 54)')
    })
  })

  it('should allow to upload a batch, save it to the library, download it & remove it', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findAllByText('choose a file')
        .attachFile('test-batch.json', { subjectType: 'drag-n-drop' })
      getBody().findAllByText('uploaded').wait(300)
      getBody().find('button[title="Save to Library"]').click()
      getBody()
        .findByLabelText(/Batch name/i)
        .type('E2E test')
      getBody().findAllByText('Create').should('not.be.disabled').click()
      getBody()
        .findByText(/Your transaction library/i)
        .click()
      getBody().find('button[title="Download batch"]').click()
      getBody().find('button[title="Delete Batch"]').click()
      getBody().findAllByText('Yes, delete').should('not.be.disabled').click()
      getBody()
        .findByText(/You don't have any saved batches./i)
        .should('be.visible')
      getBody()
        .findByText(/Back to Transaction Creation/i)
        .should('be.visible')
    })
    cy.readFile('cypress/downloads/E2E test.json').should('exist')
  })

  it('should simulate a valid batch as successful', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD')
      getBody()
        .findByLabelText(/gor value */i)
        .type('0')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/Simulate/i)
        .click()
      getBody().findByText('Transfer').should('be.visible')
      getBody().findByText('Success').should('be.visible')
    })
  })

  it('should simulate an invalid batch as failed', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('gor:0xE96C43C54B08eC528e9e815fC3D02Ea94A320505')
      getBody()
        .findByText(/Keep Proxy ABI/i)
        .click()
      getBody()
        .findByLabelText(/gor value */i)
        .type('100')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/Simulate/i)
        .click()
      getBody().findByText('Failed').should('be.visible')
    })
  })
})
