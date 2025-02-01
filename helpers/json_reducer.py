import json
import os
import glob

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Create directories if they don't exist
input_dir = os.path.join(script_dir, '..', 'events')
output_dir = os.path.join(script_dir, '..', 'events', 'light')
os.makedirs(output_dir, exist_ok=True)

# Get all JSON files in the input directory
json_files = glob.glob(os.path.join(input_dir, '*.json'))
print(f"Found {len(json_files)} JSON files")

for json_file in json_files:
    # Skip files in the light subdirectory
    if '/light/' in json_file or '\\light\\' in json_file:
        continue
        
    # Read the input JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Remove description field from each event
    if isinstance(data, list):
        for event in data:
            if 'description' in event:
                del event['description']
    elif isinstance(data, dict) and 'description' in data:
        del data['description']
    
    # Create output filename
    base_name = os.path.basename(json_file)
    output_name = os.path.splitext(base_name)[0] + '_LIGHT.json'
    output_path = os.path.join(output_dir, output_name)
    
    # Write the modified JSON to the output file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

print("Processing complete. Light versions created in ../events/light/")