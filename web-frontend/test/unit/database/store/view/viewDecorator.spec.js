import { TestApp } from '@baserow/test/helpers/testApp'

describe('View store - decorator', () => {
  let testApp = null
  let store = null

  beforeEach(() => {
    testApp = new TestApp()
    store = testApp.store
  })

  afterEach(() => {
    testApp.afterEach()
  })

  test('create decoration', async () => {
    const view = {
      id: 42,
      decorations: [],
    }

    await store.dispatch('view/createDecoration', {
      view,
      values: {
        type: 'left_border_color',
        value_provider: 'single_select_color',
      },
    })

    expect(view.decorations.length).toBe(1)
    expect(view.decorations[0].id).toBeDefined()
    expect(view.decorations[0].type).toBe('left_border_color')
    expect(view.decorations[0].value_provider).toBe('single_select_color')
    expect(view.decorations[0]._).toEqual({ loading: false })

    await store.dispatch('view/forceCreateDecoration', {
      view,
      values: {
        type: 'background_color',
        value_provider: 'conditional_color',
      },
    })

    expect(view.decorations.length).toBe(2)
    expect(view.decorations[1].type).toBe('background_color')
    expect(view.decorations[1].value_provider).toBe('conditional_color')
    expect(view.decorations[1]._).toEqual({ loading: false })
  })

  test('update decoration', async () => {
    const decoration = {
      id: 1,
      type: 'left_border_color',
      value_provider: 'single_select_color',
      _: {
        loading: false,
      },
    }
    const view = {
      id: 42,
      decorations: [decoration],
    }

    await store.dispatch('view/updateDecoration', {
      view,
      decoration,
      values: {
        type: 'background_color',
      },
    })

    expect(view.decorations.length).toBe(1)
    expect(view.decorations[0].type).toBe('background_color')
    expect(view.decorations[0].value_provider).toBe('single_select_color')
    expect(view.decorations[0]._).toEqual({ loading: false })
  })

  test('delete decoration', async () => {
    const decoration = {
      id: 1,
      type: 'left_border_color',
      value_provider: 'single_select_color',
      _: {
        loading: false,
      },
    }
    const view = {
      id: 42,
      decorations: [decoration],
    }

    await store.dispatch('view/deleteDecoration', {
      view,
      decoration,
    })

    expect(view.decorations.length).toBe(0)
  })
})
