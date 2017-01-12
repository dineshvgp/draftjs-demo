import React from 'react';
import { Button } from 'reactstrap';
import {EditorState, RichUtils} from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import mentions from './mentions';
import ImageAdd from './ImageAdd';
import ImageUpload from './ImageUpload';

import BlockStyleControls from './BlockStyleControls.js';
import InlineStyleControls from './InlineStyleControls';

import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import "./Draft.css";
import "./RichEditor.css";
import './style.css';

const hashtagPlugin = createHashtagPlugin();

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

const imagePlugin = createImagePlugin();

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: mentions
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.onSearchChange = (value) => this._onSearchChange(value);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  _onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  render() {
    const {editorState} = this.state
    const {showCount, socialType, responseCount} = this.props

    const plugins = [emojiPlugin, imagePlugin]
    if(socialType === 'twitter') {
      plugins.push(hashtagPlugin, mentionPlugin);
    }

    let balanceCount = 0
    if(showCount) {
      balanceCount = responseCount - editorState.getCurrentContent().getPlainText().length
    }

    const opts = (balanceCount < 0) ? {disabled: 'true'} : {}

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div>
        <div className='RichEditor-root'>
           <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
            />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
            />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={this.getBlockStyle}
              customStyleMap={styleMap}
              placeholder="Write a tweet..."
              editorState={editorState}
              ref="editor"
              handleKeyCommand={this.handleKeyCommand}
              onTab={this.onTab}
              spellCheck={true}
              plugins={plugins}
              onChange={this.onChange} />
            <EmojiSuggestions />
            <MentionSuggestions
              onSearchChange={this.onSearchChange}
              suggestions={this.state.suggestions}
            />
          </div>
        </div>
        <Button className='send-button' color="primary" {...opts}> Send </Button>
        {
          showCount &&
          <div className='balance-count'> {balanceCount} </div>
        }
        <ImageUpload
          editorState={editorState}
          onChange={this.onChange}
          modifier={imagePlugin.addImage}
        />
      </div>
    );
  }
}

export default HelloWorld;
