import { buildUrl } from '../../utils/urlBuilder' // Adjust the import based on your file structure

describe('buildUrl', () => {
  it('should build a URL correctly with valid replacements', () => {
    const template = 'https://example.com/{category}/{id}'
    const replacements = { category: 'books', id: '123' }

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://example.com/books/123')
  })

  it('should replace multiple placeholders correctly', () => {
    const template = 'https://api.example.com/{version}/users/{id}'
    const replacements = { version: 'v1', id: '456' }

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://api.example.com/v1/users/456')
  })

  it('should return the template unchanged if no replacements are provided', () => {
    const template = 'https://example.com/{category}/{id}'
    const replacements = {} // No replacements

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://example.com/{category}/{id}')
  })

  it('should handle missing placeholders in the template gracefully', () => {
    const template = 'https://example.com/{category}/{id}'
    const replacements = { category: 'books' } // Missing 'id'

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://example.com/books/{id}')
  })

  it('should handle empty template correctly', () => {
    const template = ''
    const replacements = { category: 'books', id: '123' }

    const result = buildUrl(template, replacements)

    expect(result).toBe('')
  })

  it('should handle empty replacements correctly', () => {
    const template = 'https://example.com/{category}/{id}'
    const replacements = {} // Empty replacements

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://example.com/{category}/{id}')
  })

  it('should not modify the template if there are no placeholders', () => {
    const template = 'https://example.com/'
    const replacements = { category: 'books' }

    const result = buildUrl(template, replacements)

    expect(result).toBe('https://example.com/')
  })
})
