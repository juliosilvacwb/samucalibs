import React from 'react';
import './multi-select-aria.css';

class MultiSelectAria extends React.Component {
    constructor(props) {
        super(props);

        this.isLoadingText = props.isLoadingText ? props.isLoadingText : 'It\'s Loading';
        this.isEmptyText = props.isEmptyText ? props.isEmptyText : 'It\'s empty';
        this.placeholder = props.placeholder ? props.placeholder : 'Type to search';
        this.refInputEl = React.createRef();

        this.state = {
            width: 100,
            list: props.list ? props.list: [],
            selecteds: props.selecteds ? props.selecteds : [],
            optionSelected: 0,
            showOptionList: false,
            isLoading: false,
            filter: '',
            ariaSelected: '',
            ariaActivedescendant: null,
        };
    }

    componentWillReceiveProps(newProps) {
      if(!this.isListEquals(newProps.list, this.state.list)) {
        this.setState({...this.state, list: newProps.list, optionSelected: 0})
      }
      
      if(!this.isListEquals(newProps.selecteds, this.state.selecteds)) {
            this.setState({...this.state, selecteds: newProps.selecteds})
      }

      if(newProps.isLoading !== this.state.isLoading) {
            this.setState({...this.state, isLoading: newProps.isLoading, optionSelected: 0})
      }
    }

    componentDidMount() {
      document.addEventListener("mousedown", this.handleClickOutside);
      let width = document.getElementById('msa-main').offsetWidth;
      this.setState({...this.state, width})
    }
  
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleOptionClick);
    }

    isListEquals(a, b) {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val.label === b[index].label && val.value === b[index].value);
    }
  
    handleClickOutside = e => {
      if (
        !e.target.classList.contains("custom-select-option") &&
        !e.target.classList.contains("msa-input")
      ) {
        this.setState({
          showOptionList: false,
          optionSelected: 0
        });
      }
    };
  
    handleListDisplay = () => {
      this.setState({ ...this.state, showOptionList: true });
    };
  
    handleOptionSelected = (index) => {
      this.refInputEl.current.focus();
      if (this.props.onSelect) {
        this.props.onSelect([...this.state.selecteds, this.state.list[index]])
      } else {
        this.setState({...this.state, selecteds: [...this.state.selecteds, this.state.list[index]]})
      }
    };

    clearListOfSelecteds = () => {
      this.refInputEl.current.focus();
      if (this.props.onSelect) {
        this.props.onSelect([])
      } else {
        this.setState({...this.state, selecteds: []})
      }
    };

    onKeyControl = e => {
      if (e.key === 'ArrowDown') {
          if (this.state.optionSelected < ( this.state.list.length - 1)) {
            this.onOptionOver(this.state.optionSelected+1);
          } else {
            this.onOptionOver({...this.state, optionSelected: 0 });
          }
      } else if (e.key === 'ArrowUp') {
        if(this.state.optionSelected > 0) {
          this.onOptionOver(this.state.optionSelected-1);
        } else {
          this.onOptionOver(this.state.list.length - 1);
        }
      }

      if (e.key === 'Enter') {
        this.handleOptionSelected(this.state.optionSelected);
      }
      
      if (e.key === 'Tab') {
        this.setState({...this.state, showOptionList: false})
      }
      
    }

    onChange = (value) => {
      this.setState({...this.state, filter: value});
      if (this.props.onInputChange) {
        this.props.onInputChange(value);
      }
    }

    onOptionOver = (index) => {
      let labelOfSelected = this.state.list[index].label ? this.state.list[index].label : '';
      let ariaActivedescendant = `listItem${index}`;
      this.setState({...this.state, optionSelected: index, ariaSelected: labelOfSelected, ariaActivedescendant });
    }

    listWithoutSelecteds = () => {
      return this.state.list.filter(item => this.state.selecteds.filter((selected) => item.label === selected.label).length === 0);
    }

    render() {
        return  <div>
                    <div className={'msa-container'}>
                        <div 
                          id="msa-main" 
                          className={`msa-main ${this.props.classBox? this.props.classBox : ''}`} 
                          onClick={() => this.refInputEl.current.focus()}>
                            {
                              this.state.selecteds.map((item, y) => <span key={y} className={'chip'}>{item.label}</span>)
                            }
                            <input 
                              ref={this.refInputEl}
                              type="text"
                              value={this.filter}
                              className={'msa-input'} 
                              className={`msa-input ${this.props.classInput? this.props.classInput : ''}`} 
                              onChange={e => this.onChange(e.target.value)}
                              onFocus={this.handleListDisplay} 
                              onKeyDown={this.onKeyControl} 
                              role={'listbox'}
                              aria-multiselectable={true}
                              aria-haspopup={true}
                              aria-expanded={this.state.showOptionList}
                              aria-owns={this.props.listName ? this.props.listName : 'list'}
                              aria-selected={this.state.ariaSelected}
                              aria-activedescendant={this.state.activedescendant}
                            />
                            <button 
                              className={`clear ${this.props.cassClearButton? this.props.cassClearButton : ''}`} 
                              onClick={() => this.clearListOfSelecteds()}
                            >
                              x
                            </button>
                        </div>
                        {this.state.showOptionList && (
                            <ul 
                              className={`select-options ${this.props.classOptions? this.props.classOptions : ''}`} 
                              style={{maxWidth: this.state.width}} 
                              id={this.props.listName ? this.props.listName : 'list'}
                            >
                                {
                                  !this.state.isLoading &&
                                  this.listWithoutSelecteds()
                                  .map((option, i) => {
                                    return (
                                        <li
                                            id={`listItem${i}`}
                                            className={`
                                              custom-select-option 
                                              ${this.props.classOptionsItem? this.props.classOptionsItem : ''} 
                                              ${this.state.optionSelected === i ? ' selected' : ''}
                                            `} 
                                            data-name={option.label}
                                            key={i}
                                            onClick={() => this.handleOptionSelected(i) }
                                            onMouseOver={() => this.onOptionOver(i)}
                                            role={'option'}
                                            aria-selected={option.label}
                                            >
                                            {option.label}
                                        </li>
                                    )})
                                }
                                {
                                  (this.listWithoutSelecteds().length === 0 && !this.state.isLoading) && 
                                  <li 
                                    className="custom-select-option" 
                                    role={'option'}
                                    aria-selected={!this.state.filter ? this.placeholder : this.isEmptyText}
                                  >
                                    {!this.state.filter ? this.placeholder : this.isEmptyText}
                                  </li>
                                }
                                {
                                  (this.state.isLoading) && 
                                  <li 
                                    className="custom-select-option" 
                                    role={'option'}
                                    aria-selected={this.isLoadingText}
                                  >
                                    {this.isLoadingText}
                                  </li>
                                }
                            </ul>
                        )}
                    </div>
                </div>
    }
}

export default MultiSelectAria;