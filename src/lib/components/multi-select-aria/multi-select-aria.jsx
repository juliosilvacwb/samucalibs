import PropTypes from 'prop-types';
import React from 'react';
import './multi-select-aria.css';

let typingTimer;
class MultiSelectAria extends React.Component {
  constructor(props) {
    super(props);
    this.refInputEl = React.createRef();
    this.hashId = btoa(new Date().getTime()).replace('==', '').toLowerCase().replace(/\d/g, '');

    let selecteds = [];
    if (props.multi) {
      selecteds = [...props.selected]
    } else if (!props.multi && props.selected) {
      selecteds = [props.selected]
    }

    this.state = {
      width: 100,
      options: props.options,
      selecteds,
      optionSelected: 0,
      showOptionList: false,
      isLoading: false,
      filter: '',
      activedescendant: props.options.length > 0 ? props.options[0][props.labelKey] : null,
    };
  }

  componentWillReceiveProps(newProps) {
    let { selected, isLoading: newIsLoading, options: newOptions, statick } = newProps;
    let { selecteds, isLoading, options, filter } = this.state;
    let { minimumInput, labelKey, valueKey, showOptionSelected } = this.props;

    if (!Array.isArray(selected)) {
      selected = (selected && selected[valueKey]) ? [selected] : [];
    }

    let state = { ...this.state, optionSelected: 0, activedescendant: `${this.hashId}-item-${0}`, isLoading: newIsLoading };
    let isOptionsEquals = this.isListEquals(newOptions, options);
    let isSeletedsEquals = this.isListEquals(selected, selecteds);
    let isInputMinimum = filter.length >= minimumInput;
    let isLoadingEquals = newIsLoading !== isLoading;

    if (!isOptionsEquals && isInputMinimum) {
      if (!showOptionSelected) {
        const options = newOptions.filter(item =>
          selecteds.filter((selected) => item[labelKey] === selected[labelKey]).length === 0);

        if (!isSeletedsEquals) {
          this.setState({ ...state, options, selecteds: selected })
        } else {
          this.setState({ ...state, options })
        }
      } else {
        if (!isSeletedsEquals) {
          this.setState({ ...state, selecteds: selected, options: newOptions })
        } else {
          this.setState({ ...state, options: newOptions })
        }
      }
    } else if (!isOptionsEquals && !isInputMinimum && statick) {
      this.setState({ ...this.state, options: newOptions, isLoading: newIsLoading });
    } else if (isLoadingEquals) {
      if (!isSeletedsEquals) {
        this.setState({ ...state, selecteds: selected })
      } else {
        this.setState({ ...state })
      }
    } else if (!isSeletedsEquals) {
      this.setState({ ...this.state, selecteds: selected })
    }
  }

  componentDidMount() {

    if (this.props.multi && this.props.initialValue) {
      this.props.onSelect([...this.props.selected, this.props.initialValue]);
    } else if (!this.props.multi && !this.props.selected && this.props.initialValue) {
      this.props.onSelect(this.props.initialValue);
    }

    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOptionClick);
  }

  isListEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val[this.props.labelKey] === b[index][this.props.labelKey] && val[this.props.valueKey] === b[index][this.props.valueKey]);
  }

  handleClickOutside = e => {
    if (!e.target.classList.contains(this.hashId)) {
      this.setState({
        ...this.state,
        showOptionList: false,
        optionSelected: 0
      });
    }
  };

  handleListDisplay = () => {
    let width = document.getElementById(this.hashId).offsetWidth;
    this.setState({ ...this.state, showOptionList: true, width, activedescendant: `${this.hashId}-item-${0}` });
  };

  handleOptionSelected = (index) => {
    let showOptionList = false;
    if (this.props.multi) {
      this.refInputEl.current.focus();
      showOptionList = true;
    }

    const selecteds = this.props.multi ? [...this.state.selecteds, this.state.options[index]] : [this.state.options[index]];

    if (this.props.statick) {
      this.setState({ ...this.state, selecteds, filter: '', showOptionList });
    } else {
      this.setState({ ...this.state, selecteds, options: [], filter: '', showOptionList });
    }

    setTimeout(() => {
      if (this.props.onSelect) {
        if (this.props.multi) {
          this.props.onSelect(selecteds);
        } else {
          this.props.onSelect(selecteds[0]);
        }
        if (this.props.onInputChange) {
          this.props.onInputChange('');
        }
      }
    }, 500)

  };

  clearListOfSelecteds = () => {
    const selecteds = this.props.initialValue ? [this.props.initialValue] : [];
    this.setState({ ...this.state, selecteds, filter: '' })

    if (this.props.onSelect) {
      if (this.props.multi && !this.props.statick) {
        this.props.onSelect([]);
      } else if (this.props.multi && this.props.statick) {
        this.props.onSelect(selecteds);
      } else if (!this.props.multi && this.props.statick) {
        this.props.onSelect(this.props.initialValue);
      } else {
        this.props.onSelect(undefined);
      }
    }

    setTimeout(() => {
      this.refInputEl.current.focus();
    }, 300);
  };

  onKeyControl = e => {
    if (e.key === 'ArrowDown') {
      if (this.state.optionSelected < (this.state.options.length - 1)) {
        this.onOptionOver(this.state.optionSelected + 1);
      } else {
        this.onOptionOver({ ...this.state, optionSelected: 0 });
      }
    } else if (e.key === 'ArrowUp') {
      if (this.state.optionSelected > 0) {
        this.onOptionOver(this.state.optionSelected - 1);
      } else {
        this.onOptionOver(this.state.options.length - 1);
      }
    }

    if (e.key === 'Enter') {
      if (this.state.options.length > 0) {
        this.handleOptionSelected(this.state.optionSelected);
      }
    }

    if (e.key === 'Tab') {
      this.setState({ ...this.state, showOptionList: false })
    }

    if (e.key === 'Backspace') {
      if (this.state.filter.length === 0) {
        let selecteds = this.state.selecteds.slice(0, this.state.selecteds.length - 1);
        if (selecteds.length === 0 && this.props.initialValue) {
          selecteds = this.state.multi ? [this.props.initialValue] : this.props.initialValue;
        }
        this.setState({ ...this.state, selecteds })
        setTimeout(() => this.props.onSelect(selecteds), 300);
      }
    }

  }

  onChange = (value) => {
    const options = this.props.statick ? this.state.options.filter(item => item[this.props.labelKey].toLowerCase().includes(value.toLowerCase())) : this.state.options;
    if (this.props.multi) {
      this.setState({ ...this.state, options, filter: value });
    } else {
      this.setState({ ...this.state, options, filter: value, selecteds: [] });
      setTimeout(() => this.props.onSelect(undefined));
    }

    if (!this.props.statick) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (this.props.onInputChange && value.length >= this.props.minimumInput) {
          this.props.onInputChange(value);
        }
      });
    }
  }

  onOptionOver = (index) => {
    let activedescendant = `${this.hashId}-item-${index}`
    this.setState({ ...this.state, optionSelected: index, activedescendant });
  }

  optionsWithoutSelecteds = () => {
    return this.state.options.filter(item => this.state.selecteds.filter((selected) => item[this.props.labelKey] === selected[this.props.labelKey]).length === 0);
  }

  render() {
    return <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className={`msa-container ${this.props.classContainer ? this.props.classContainer : ''}`>
        <div
          id={this.hashId}
          className={`msa-main ${this.props.classBox ? this.props.classBox : ''}`}
          onClick={() => this.refInputEl.current.focus()}
        >
          {
            this.props.multi &&
            this.state.selecteds.map((item, y) => <span key={y} className={'chip'}>{item[this.props.labelKey]}</span>)
          }
          <input
            id={this.props.id ? this.props.id : undefined}
            ref={this.refInputEl}
            placeholder={this.props.multi || this.state.selecteds.length === 0 ? this.props.placeholder : ''}
            type="text"
            value={this.state.filter}
            className={`${this.hashId} msa-input ${this.props.classInput ? this.props.classInput : ''} ${this.props.multi || this.state.selecteds.length === 0 ? 'msa-input-multi' : ''}`}
            onChange={e => this.onChange(e.target.value)}
            onFocus={this.handleListDisplay}
            onKeyDown={this.onKeyControl}
            style={{
              width: !this.props.multi && this.state.selecteds.length > 0 ? '2px' : undefined
            }}
            aria-multiselectable={true}
            aria-haspopup={'listbox'}
            aria-expanded={this.state.showOptionList}
            aria-controls={this.props.listName ? this.props.listName : `options-${this.hashId}`}
            aria-owns={this.props.listName ? this.props.listName : `options-${this.hashId}`}
            aria-activedescendant={this.state.activedescendant}
            aria-autocomplete="list"
            autoComplete="off"
          />
          {
            (!this.props.multi && this.state.selecteds.length > 0 && this.state.selecteds[0] && this.state.selecteds[0].hasOwnProperty(this.props.labelKey))
            && (<span className={'chip-single'}>{this.state.selecteds[0][this.props.labelKey]}</span>)
          }
        </div>
        {this.state.showOptionList && (
          <ul
            role={'listbox'}
            className={`select-options ${this.props.classOptions ? this.props.classOptions : ''}`}
            style={{ maxWidth: this.state.width, minWidth: this.state.width }}
            id={this.props.listName ? this.props.listName : `options-${this.hashId}`}
          >
            {
              !this.state.isLoading &&
              this.state.options.map((option, i) => {
                return (
                  <li
                    id={`${this.hashId}-item-${i}`}
                    role={'option'}
                    className={`${this.hashId} custom-select-option 
                                              ${this.props.classOptionsItem ? this.props.classOptionsItem : ''} 
                                              ${this.state.optionSelected === i ? ' selected' : ''}
                                            `}
                    data-name={option[this.props.labelKey]}
                    key={i}
                    onClick={() => this.handleOptionSelected(i)}
                    onMouseOver={() => this.onOptionOver(i)}
                    aria-selected={this.state.activedescendant === `${this.hashId}-item-${i}`}
                  >
                    {option[this.props.labelKey]}
                  </li>
                )
              })
            }
            {
              (this.state.options.length === 0 && !this.state.isLoading && !this.props.statick) &&
              <li
                className="custom-select-option"
                role={'option'}
                aria-selected={this.state.options.length === 0 && !this.state.isLoading && !this.props.statick}
                id={`${this.hashId}-item-${0}`}
              >
                {this.state.filter.length < this.props.minimumInput ? this.props.searchPromptText : this.props.noResultsText}
              </li>
            }
            {
              (this.state.isLoading) &&
              <li
                className="custom-select-option"
                role={'option'}
                aria-selected={this.state.isLoading}
                id={`${this.hashId}-item-${0}`}
              >
                {this.props.isLoadingText}
              </li>
            }
          </ul>
        )}
      </div>
      <button
        aria-label="Clear"
        className={`clear ${this.props.cassClearButton ? this.props.cassClearButton : ''}`}
        onClick={() => this.clearListOfSelecteds()}
      >
        x
                    </button>
    </div>
  }
}

MultiSelectAria.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: function (props, propName, componentName) {
    if (!props.hasOwnProperty(propName)) {
      return new Error('selected is required.');
    }
    if (props.multi && !Array.isArray(props.selected)) {
      throw Error('selected should be a array for multi selections')
    }
  },
};

MultiSelectAria.defaultProps = {
  isLoadingText: 'It\'s Loading',
  noResultsText: 'It\'s empty',
  placeholder: '',
  searchPromptText: 'Type to search',
  minimumInput: 3,
  labelKey: 'label',
  valueKey: 'value'
};

export default MultiSelectAria;