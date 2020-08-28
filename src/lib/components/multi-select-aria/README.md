## Props

| Field              | Type         | Required | Default        | Description                                                                          |
| ------------------ | ------------ | -------- | -------------- | ------------------------------------------------------------------------------------ |
| labelKey           | string       | no       | label          | Field name for the label.                                                            |
| valueKey           | string       | no       | value          | Field name for the value.                                                            |
| options            | array        | yes      |                | Array of options, should contains objects with labelKey and valueKey fields.         |
| selected           | object/array | yes      |                | Array or Object selected, should contains objects with labelKey and valueKey fields. |
| onSelect           | func         | yes      |                | Fuction to change list of selecteds.                                                 |
| onInputChange      | func         | false    |                | Return the string typed.                                                             |
| isLoadingText      | string       | no       | It's Loading   | Text displayed when options is loading.                                              |
| noResultsText      | string       | no       | It's empty     | Text displayed when there are no options.                                            |
| searchPromptText   | string       | no       | Type to search | Text for guidance.                                                                   |
| placeholder        | string       | no       |                | Placeholder for input.                                                               |
| isLoading          | bool         | no       | false          | Indcate if options are loading.                                                      |
| classMain          | string       | no       |                | Class for overwrite design.                                                          |
| classContainer     | string       | no       |                | Class for overwrite design.                                                          |
| classBox           | string       | no       |                | Class for overwrite design.                                                          |
| classChip          | string       | no       |                | Class for overwrite design.                                                          |
| classInput         | string       | no       |                | Class for overwrite design.                                                          |
| cassClearButton    | string       | no       |                | Class for overwrite design.                                                          |
| classOptions       | string       | no       |                | Class for overwrite design.                                                          |
| classOptionsItem   | string       | no       |                | Class for overwrite design.                                                          |
| listName           | string       | no       | list           | ID for list of options.                                                              |
| id                 | string       | no       | undefined      | ID for component                                                                     |
| minimumInput       | number       | no       | 3              | Minimum characters to search start.                                                  |
| multi              | bool         | no       | false          | Allows multiple choices.                                                             |
| statick            | bool         | no       | false          | If true don't reload options.                                                        |
| showOptionSelected | bool         | no       | false          | Show the items selecteds in list options.                                            |
