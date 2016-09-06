{React, ReactBootstrap} = window
{Panel, FormControl, Button} = ReactBootstrap
__ = window.i18n["poi-plugin-hensei-nikki"].__.bind(window.i18n["poi-plugin-hensei-nikki"])

TitleEditor = React.createClass
  getInitialState: ->
    titleInput: ''
    btnDisable: true
  componentWillReceiveProps: (nextProps) ->
    if nextProps.editTitle and !@props.editTitle
      @setState
        titleInput: @props.activeTitle
        btnDisable: true
  handleTitleInputChange: (e) ->
    titleInput = e.target.value
    if titleInput? and titleInput.length > 0 and titleInput isnt @props.activeTitle
      btnDisable = false
    else
      btnDisable = true
    @setState
      titleInput: titleInput
      btnDisable: btnDisable
  handleTitleSaveClick: ->
    flag = true
    for title in @props.henseiData.titles
      if title is @state.titleInput
        toggleModal __('Error'), __('The title is already exist.')
        flag = false
    if flag
      @props.handleTitleSaveClick @state.titleInput
  render: ->
    <Panel collapsible expanded={@props.editTitle} style={marginTop: 10, marginBottom: 0}>
      <FormControl style={margin: 10}
                   type='text'
                   label={__ 'Title'}
                   placeholder={__ 'Title'}
                   value={@state.titleInput}
                   ref='titleInput'
                   onChange={@handleTitleInputChange} />
      <Button style={height: '50%', width: '50%', margin: 10}
              bsSize='small'
              disabled={@state.btnDisable}
              onClick={@handleTitleSaveClick}>
        {__ 'Save'}
      </Button>
    </Panel>
module.exports = TitleEditor