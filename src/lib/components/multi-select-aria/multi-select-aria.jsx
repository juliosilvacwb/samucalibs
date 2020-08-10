import React from 'react';
import PropTypes from 'prop-types';
import './multi-select-aria.css';

let typingTimer;
class MultiSelectAria extends React.Component {
    constructor(props) {
        super(props);

        this.isLoadingText = props.isLoadingText ? props.isLoadingText : 'It\'s Loading';
        this.noResultsText = props.noResultsText ? props.noResultsText : 'It\'s empty';
        this.placeholder = props.placeholder ? props.placeholder : '';
        this.searchPromptText = props.searchPromptText ? props.searchPromptText : 'Type to search';
        this.minimumInput = props.minimumInput ? props.minimumInput : 3;
        this.refInputEl = React.createRef();
        this.multi = !!this.props.multi;
        this.labelKey = props.labelKey ? props.labelKey : 'label';
        this.valueKey = props.valueKey ? props.valueKey : 'value';

        this.hashId = btoa(new Date().getTime()).replace('==', '').toLowerCase().replace(/\d/g, '');

        this.state = {
            width: 100,
            options: props.options,
            selecteds: props.initialValue ? [props.initialValue] : [],
            optionSelected: 0,
            showOptionList: false,
            isLoading: false,
            filter: '',
            activedescendant: props.options.length > 0 ? props.options[0][this.labelKey]: null,
        };
    }

    componentWillReceiveProps(newProps) {
      if(!this.isListEquals(newProps.options, this.state.options) && this.state.filter.length > this.minimumInput) {
        if (!this.props.showOptionSelected) {
          const options = newProps.options.filter(item => 
            this.state.selecteds.filter((selected) => item[this.labelKey] === selected[this.labelKey]).length === 0);
          this.setState({...this.state, options, optionSelected: 0, ariaActivedescendant: `${this.hashId}-item-${0}`, isLoading: newProps.isLoading})
        } else {
          this.setState({...this.state, options: newProps.options, optionSelected: 0, ariaActivedescendant: `${this.hashId}-item-${0}`, isLoading: newProps.isLoading})
        }
      } else if(newProps.isLoading !== this.state.isLoading) {
        this.setState({...this.state, isLoading: newProps.isLoading, optionSelected: 0, ariaActivedescendant: `${this.hashId}-item-${0}`})
      }
    }

    componentDidMount() {
      document.addEventListener("mousedown", this.handleClickOutside);
    }
  
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleOptionClick);
    }

    isListEquals(a, b) {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val[this.labelKey] === b[index][this.labelKey] && val[this.valueKey] === b[index][this.valueKey]);
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
      this.setState({ ...this.state, showOptionList: true, width });
    };
  
    handleOptionSelected = (index) => {
      let showOptionList = false;
      if (this.multi) {
        this.refInputEl.current.focus();
        showOptionList = true;
      } 
      
      const selecteds = this.multi ? [...this.state.selecteds, this.state.options[index]] : [this.state.options[index]];

      if (this.props.static) {
        this.setState({...this.state, selecteds, filter: '', showOptionList});
      } else {
        this.setState({...this.state, selecteds, options:[], filter: '', showOptionList});
      }
      
      setTimeout(() => {
        if (this.props.onSelect) {
          if (this.multi) {
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
      this.setState({...this.state, selecteds, filter: ''})

      if (this.props.onSelect) {
        if (this.multi && !this.props.static ) {
          this.props.onSelect([]);
        } else if (this.multi && this.props.static) {
          this.props.onSelect(selecteds);
        } else if (!this.multi && this.props.static) {
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
          if (this.state.optionSelected < ( this.state.options.length - 1)) {
            this.onOptionOver(this.state.optionSelected+1);
          } else {
            this.onOptionOver({...this.state, optionSelected: 0 });
          }
      } else if (e.key === 'ArrowUp') {
        if(this.state.optionSelected > 0) {
          this.onOptionOver(this.state.optionSelected-1);
        } else {
          this.onOptionOver(this.state.options.length - 1);
        }
      }

      if (e.key === 'Enter') {
        this.handleOptionSelected(this.state.optionSelected);
      }
      
      if (e.key === 'Tab') {
        this.setState({...this.state, showOptionList: false})
      }
      
      if (e.key === 'Backspace') {
          let selecteds = this.state.selecteds.slice(0, this.state.selecteds.length-1);
          if (selecteds.length === 0 && this.props.initialValue) {
            selecteds = [this.props.initialValue];
          }
          this.setState({...this.state, selecteds})
      }
      
    }

    onChange = (value) => {
      const options = this.props.static ? this.state.options.filter(item => item[this.labelKey].toLowerCase().includes(value.toLowerCase())) : this.state.options;
      if (this.multi) {
        this.setState({...this.state, options, filter: value});
      } else {
        this.setState({...this.state, options, filter: value, selecteds: []});
      }

      if (!this.props.static) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          if (this.props.onInputChange && value.length >= this.minimumInput) {
            this.props.onInputChange(value);
          }
        }, 500);
      } 
    }

    onOptionOver = (index) => {
      let activedescendant = `${this.hashId}-item-${index}`
      this.setState({...this.state, optionSelected: index, activedescendant });
    }

    optionsWithoutSelecteds = () => {
      return this.state.options.filter(item => this.state.selecteds.filter((selected) => item[this.labelKey] === selected[this.labelKey]).length === 0);
    }

    render() {
        return  <div style={{display:'flex', alignItems: 'center'}}>
                    <div className={'msa-container'}>
                        <div 
                          id={this.hashId} 
                          className={`msa-main ${this.props.classBox? this.props.classBox : ''}`} 
                          onClick={() => this.refInputEl.current.focus()}
                        >
                            {
                              this.multi && 
                              this.state.selecteds.map((item, y) => <span key={y} className={'chip'}>{item[this.labelKey]}</span>)
                            }
                            <input 
                              id={this.props.id ? this.props.id : undefined}
                              ref={this.refInputEl}
                              placeholder={this.multi || this.state.selecteds.length === 0 ? this.placeholder : ''}
                              type="text"
                              value={this.state.filter}
                              className={`${this.hashId} msa-input ${this.props.classInput? this.props.classInput : ''} ${this.multi || this.state.selecteds.length === 0 ? 'msa-input-multi' : ''}`} 
                              onChange={e => this.onChange(e.target.value)}
                              onFocus={this.handleListDisplay} 
                              onKeyDown={this.onKeyControl} 
                              style={{
                                width: !this.multi && this.state.selecteds.length > 0 ? '2px' : undefined
                              }}
                              aria-multiselectable={true}
                              aria-haspopup={'listbox'}
                              aria-expanded={this.state.showOptionList}
                              aria-owns={this.props.listName ? this.props.listName : `options-${this.hashId}`}
                            />
                            {
                              (!this.multi && this.state.selecteds.length > 0) &&
                              <span className={'chip-single'}>{this.state.selecteds[0][this.labelKey]}</span>
                            }
                        </div>
                        {this.state.showOptionList && (
                            <ul 
                              role={'listbox'}
                              aria-activedescendant={this.state.activedescendant}
                              className={`select-options ${this.props.classOptions? this.props.classOptions : ''}`} 
                              style={{maxWidth: this.state.width, minWidth:  this.state.width }} 
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
                                              ${this.props.classOptionsItem? this.props.classOptionsItem : ''} 
                                              ${this.state.optionSelected === i ? ' selected' : ''}
                                            `} 
                                            data-name={option[this.labelKey]}
                                            key={i}
                                            onClick={() => this.handleOptionSelected(i) }
                                            onMouseOver={() => this.onOptionOver(i)}
                                            aria-selected={this.state.activedescendant === `${this.hashId}-item-${i}`}
                                            >
                                            {option[this.labelKey]}
                                        </li>
                                    )})
                                }
                                {
                                  (this.state.options.length === 0 && !this.state.isLoading && !this.props.static) && 
                                  <li 
                                    className="custom-select-option" 
                                    role={'option'}
                                    aria-selected={this.state.options.length === 0 && !this.state.isLoading && !this.props.static}
                                    id={`${this.hashId}-item-${0}`}
                                  >
                                    {this.state.filter.length < this.minimumInput ? this.searchPromptText : this.noResultsText}
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
                                    {this.isLoadingText}
                                  </li>
                                }
                            </ul>
                        )}
                    </div>
                    <button 
                      aria-label="Clear"
                      className={`clear ${this.props.cassClearButton? this.props.cassClearButton : ''}`} 
                      onClick={() => this.clearListOfSelecteds()}
                    >
                      x
                    </button>
                </div>
    }
}

MultiSelectAria.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default MultiSelectAria;