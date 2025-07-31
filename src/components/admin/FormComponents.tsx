import React from 'react';
// [converted from react-native] import { div, span, spanInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../utils/cn';

interface FormFieldProps {
  label: string;
  value: string;
  onChangespan: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url';
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangespan,
  placeholder,
  multiline = false,
  keyboardType = 'default',
  required = false
}) => {
  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <spanInput
        value={value}
        onChangespan={onChangespan}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
        className={cn(
          "border border-gray-300 rounded-lg px-3 py-3 text-base bg-white",
          multiline ? "h-20" : "h-12"
        )}
        textAlignVertical={multiline ? "top" : "center"}
        placeholderspanColor="#9ca3af"
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onSelect,
  required = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded-lg px-3 py-3 bg-white flex-row items-center justify-between h-12"
      >
        <span className={cn(
          "text-base",
          selectedOption ? "text-gray-900" : "text-gray-400"
        )}>
          {selectedOption ? selectedOption.label : `Select ${label.toLowerCase()}`}
        </span>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
      </Pressable>

      {isOpen && (
        <div className="border border-gray-200 rounded-lg mt-1 bg-white shadow-sm max-h-40">
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "px-3 py-3 border-b border-gray-100",
                value === option.value ? "bg-gray-50" : ""
              )}
            >
              <span className={cn(
                "text-base",
                value === option.value ? "text-black font-medium" : "text-gray-700"
              )}>
                {option.label}
              </span>
            </Pressable>
          ))}
        </div>
      )}
    </div>
  );
};

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  availableTags?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onTagsChange,
  placeholder = "Add tag...",
  availableTags = []
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </span>
      
      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
              <span className="text-sm text-gray-700">{tag}</span>
              <Pressable onPress={() => removeTag(tag)} className="ml-2">
                <Ionicons name="close" size={14} color="#6b7280" />
              </Pressable>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-row">
        <spanInput
          value={inputValue}
          onChangespan={setInputValue}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base bg-white h-10"
          placeholderspanColor="#9ca3af"
          onSubmitEditing={() => addTag(inputValue)}
          returnKeyType="done"
        />
        <Pressable
          onPress={() => addTag(inputValue)}
          className="ml-2 bg-black rounded-lg px-4 justify-center"
        >
          <span className="text-white font-medium text-sm">Add</span>
        </Pressable>
      </div>

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-gray-500 mb-2">Quick add:</span>
          <div className="flex-row flex-wrap">
            {availableTags.filter(tag => !tags.includes(tag)).map((tag, index) => (
              <Pressable
                key={index}
                onPress={() => addTag(tag)}
                className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1"
              >
                <span className="text-xs text-blue-700">{tag}</span>
              </Pressable>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ImageInputProps {
  label: string;
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  label,
  urls,
  onUrlsChange,
  maxImages = 5
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const addUrl = () => {
    const trimmedUrl = inputValue.trim();
    if (trimmedUrl && urls.length < maxImages && !urls.includes(trimmedUrl)) {
      onUrlsChange([...urls, trimmedUrl]);
      setInputValue('');
    }
  };

  const removeUrl = (urlToRemove: string) => {
    onUrlsChange(urls.filter(url => url !== urlToRemove));
  };

  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-gray-700 mb-2">
        {label} ({urls.length}/{maxImages})
      </span>
      
      {/* Current Images */}
      {urls.map((url, index) => (
        <div key={index} className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3 mb-2">
          <span className="flex-1 text-sm text-gray-600" numberOfLines={1}>
            {url}
          </span>
          <Pressable onPress={() => removeUrl(url)} className="ml-2">
            <Ionicons name="trash" size={16} color="#ef4444" />
          </Pressable>
        </div>
      ))}

      {/* Add New URL */}
      {urls.length < maxImages && (
        <div className="flex-row">
          <spanInput
            value={inputValue}
            onChangespan={setInputValue}
            placeholder="Enter image URL..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base bg-white h-10"
            placeholderspanColor="#9ca3af"
            keyboardType="url"
            autoCapitalize="none"
          />
          <Pressable
            onPress={addUrl}
            className="ml-2 bg-black rounded-lg px-4 justify-center"
          >
            <span className="text-white font-medium text-sm">Add</span>
          </Pressable>
        </div>
      )}
    </div>
  );
};