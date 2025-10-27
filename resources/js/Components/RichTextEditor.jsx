import { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../css/quill-custom.css';

/**
 * RichTextEditor Component
 * 
 * A Summernote-like rich text editor using React Quill with theme color integration.
 */
export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Enter description...',
    error = null,
    helperText = null,
    disabled = false,
    height = 200,
    className = '',
}) {
    const quillRef = useRef(null);

    // Toolbar configuration (Summernote-like)
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    }), []);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'blockquote', 'code-block',
        'list', 'bullet',
        'indent',
        'align',
        'link', 'image', 'video',
    ];

    const editorStyle = {
        '--editor-border-color': error ? '#ef4444' : '#d1d5db',
        '--editor-focus-color': error ? '#dc2626' : '#00895f',
        '--editor-focus-shadow': error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 137, 95, 0.1)',
        '--editor-height': `${height}px`,
    };

    return (
        <div className={`rich-text-editor ${className}`} style={editorStyle}>
            <div className={disabled ? 'disabled' : ''}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    readOnly={disabled}
                    style={{ height: editorStyle['--editor-height'] }}

                />
            </div>

            {error && (
                <div className="mt-1.5 flex items-center space-x-1 text-sm text-red-600">
                    <i className="fa fa-exclamation-circle"></i>
                    <span>{error}</span>
                </div>
            )}

            {!error && helperText && (
                <div className="mt-1.5 text-sm text-gray-500">
                    {helperText}
                </div>
            )}
        </div>
    );
}
