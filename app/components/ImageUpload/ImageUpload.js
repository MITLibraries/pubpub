import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnchorButton } from '@blueprintjs/core';
import Overlay from 'components/Overlay/Overlay';
import ImageCropper from 'components/ImageCropper/ImageCropper';
// import Avatar from 'components/Avatar/Avatar';
import { s3Upload } from 'utilities';

require('./imageUpload.scss');

const propTypes = {
	defaultImage: PropTypes.string,
	useCrop: PropTypes.bool,
	width: PropTypes.number,
	height: PropTypes.number,
	label: PropTypes.node,
	isRequired: PropTypes.bool,
	helperText: PropTypes.node,
	htmlFor: PropTypes.string,
	onNewImage: PropTypes.func,
	canClear: PropTypes.bool,
};

const defaultProps = {
	defaultImage: undefined,
	useCrop: false,
	width: 75,
	height: 75,
	label: undefined,
	isRequired: false,
	helperText: undefined,
	htmlFor: String(new Date().getTime()),
	onNewImage: ()=> {},
	canClear: false,
};

class ImageUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageFile: undefined,
			imageURL: undefined,
			imageBlob: this.props.defaultImage,
			uploading: false,
		};
		this.onUploadFinish = this.onUploadFinish.bind(this);
		this.onCropUploaded = this.onCropUploaded.bind(this);
		this.setBlob = this.setBlob.bind(this);
		this.handleImageSelect = this.handleImageSelect.bind(this);
		this.clearImage = this.clearImage.bind(this);
		this.cancelImageUpload = this.cancelImageUpload.bind(this);
	}

	onUploadFinish(evt, index, type, filename) {
		const newImageUrl = `https://assets.pubpub.org/${filename}`;
		this.setState({
			imageURL: newImageUrl,
			uploading: false,
		});
		this.props.onNewImage(newImageUrl);
	}

	onCropUploaded(newImageUrl, newImageBlob) {
		this.setState({
			imageFile: undefined,
			imageURL: newImageUrl,
			imageBlob: newImageBlob,
			uploading: false,
		});
		this.props.onNewImage(newImageUrl);
	}

	setBlob(image) {
		const reader = new FileReader();
		reader.onload = (imageBlob)=> {
			this.setState({ imageBlob: imageBlob.target.result });
		};
		reader.readAsDataURL(image);
	}

	handleImageSelect(evt) {
		if (evt.target.files.length && this.props.useCrop) {
			this.setState({ imageFile: evt.target.files[0] });
		}

		if (evt.target.files.length && !this.props.useCrop) {
			s3Upload(evt.target.files[0], ()=>{}, this.onUploadFinish, 0);
			this.setState({
				uploading: true,
			});
			this.setBlob(evt.target.files[0]);
		}
	}

	cancelImageUpload() {
		this.setState({
			imageFile: null,
			uploading: false,
		});
	}

	clearImage(evt) {
		evt.preventDefault();
		this.setState({
			imageFile: undefined,
			imageURL: undefined,
			imageBlob: undefined,
			uploading: false
		});
		this.props.onNewImage(null);
	}

	render() {
		const buttonStyle = {
			width: `${this.props.width}px`,
			height: `${this.props.height}px`,
			lineHeight: `${this.props.height}px`,
		};
		return (
			<div className={'image-upload'}>
				<label htmlFor={`input-${this.props.htmlFor}`}>
					{this.props.label}
					{this.props.isRequired &&
						<span className="pt-text-muted required-text"> (required)</span>
					}
					<br />

					{(this.state.uploading || !this.state.imageBlob) &&
						<AnchorButton
							className={'pt-button pt-minimal pt-icon-media'}
							style={buttonStyle}
							loading={this.state.uploading}
						/>
					}

					{!this.state.uploading && this.state.imageBlob &&
						<img
							alt={this.props.label}
							src={this.state.imageBlob}
							style={buttonStyle}
						/>
					}

					{!this.state.uploading && this.state.imageBlob &&
						<div className={'image-options'}>
							<AnchorButton className={'pt-button pt-minimal pt-icon-edit2'} />
							{this.props.canClear &&
								<button className={'pt-button pt-minimal pt-icon-trash pt-intent-danger'} onClick={this.clearImage} />
							}
						</div>
					}
					<input
						id={`input-${this.props.htmlFor}`}
						name={'logo image'}
						type="file"
						accept="image/png, image/jpeg"
						onChange={this.handleImageSelect}
					/>
				</label>
				<div className="helper-text">{this.props.helperText}</div>

				<Overlay maxWidth={300} isOpen={!!this.state.imageFile} onClose={this.cancelImageUpload}>
					<ImageCropper
						image={this.state.imageFile}
						onCancel={this.cancelImageUpload}
						onUploaded={this.onCropUploaded}
					/>
				</Overlay>
			</div>
		);
	}
}

ImageUpload.propTypes = propTypes;
ImageUpload.defaultProps = defaultProps;
export default ImageUpload;
