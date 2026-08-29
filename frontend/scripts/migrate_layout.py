import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has DashboardLayout
    if 'DashboardLayout' in content:
        return

    # 1. Remove TopNavBar
    # The TopNavBar is usually `<header className="fixed top-0 left-0...` ... `</header>`
    content = re.sub(r'\{\/\* TopNavBar \*\/.*?<\/header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<header className="fixed top-0 left-0.*?<\/header>', '', content, flags=re.DOTALL)

    # 2. Remove SideNavBar
    content = re.sub(r'\{\/\* SideNavBar \*\/.*?<\/nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'<nav className="fixed left-0 top-0.*?<\/nav>', '', content, flags=re.DOTALL)

    # 3. Replace `<main className="pl-60 pt-14...` with `<div className="flex-1 w-full bg-background">`
    content = re.sub(r'<main className="pl-60 pt-14[^>]*>', '<div className="flex-1 w-full bg-transparent">', content)
    # Some pages might have a different `<main>`
    content = re.sub(r'<main[^>]*>', '<div className="flex-1 w-full bg-transparent">', content)
    
    # Replace closing `</main>`
    content = content.replace('</main>', '</div>')

    # 4. Wrap with DashboardLayout
    # Find `return (` or `return <>` or `return <React.Fragment>`
    content = re.sub(r'return\s*\(\s*<>', 'return (\n    <DashboardLayout>', content)
    content = content.replace('</>\n  );', '</DashboardLayout>\n  );')
    content = content.replace('</>\n    );', '</DashboardLayout>\n    );')
    content = content.replace('</>\r\n  );', '</DashboardLayout>\r\n  );')
    
    # If the file doesn't have `<>` as root, this might fail, let's just do a generic approach
    if 'return (\n    <DashboardLayout>' not in content:
        # It means `return (<>` wasn't found. Let's find `return (`
        content = re.sub(r'return\s*\(\s*', 'return (\n    <DashboardLayout>\n', content, count=1)
        # And replace the last `);`
        content = re.sub(r'\);\s*\}\s*$', '    </DashboardLayout>\n  );\n}\n', content)

    # Add import
    import_statement = 'import DashboardLayout from "@/app/components/DashboardLayout";\n'
    # Put it after the last import
    last_import_idx = content.rfind('import ')
    if last_import_idx != -1:
        end_of_last_import = content.find('\n', last_import_idx) + 1
        content = content[:end_of_last_import] + import_statement + content[end_of_last_import:]
    else:
        content = import_statement + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Processed {filepath}")


if __name__ == "__main__":
    app_dir = 'app'
    skip_dirs = ['components', 'landing', 'login', 'api']
    
    for root, dirs, files in os.walk(app_dir):
        if any(skip in root for skip in skip_dirs):
            continue
        for file in files:
            if file == 'page.tsx' and root != 'app':
                process_file(os.path.join(root, file))
