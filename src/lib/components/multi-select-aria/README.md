## Props

Field | Type | Required | Default | Description
isLoadingText | string | no | It's Loading | Text displayed when options is loading.
isEmptyText | string | no | It's empty | Text displayed when there are no options.
placeholder | string | no | Type to search | Text displayed as placeholder.
list | array | yes | | List of options, should contains objects with label and value fields.
selecteds | array | yes | | List of items selecteds, should contains objects with label and value fields.
onSelect | func | yes | | Fuction to change list of selecteds.
onInputChange | func | yes | | Fuction to filter items for list.
isLoading | bool | no | false | Indcate if options are loading.

classBox | string | no | | Class for overwrite design.
classChip | string | no | | Class for overwrite design.
classInput | string | no | | Class for overwrite design.
cassClearButton | string | no | | Class for overwrite design.
classOptions | string | no | | Class for overwrite design.
classOptionsItem | string | no | | Class for overwrite design.
