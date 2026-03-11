
import openpyxl
import os


def create_excel_file(data, filename="namecards.xlsx"):
    """Creates an Excel file from a list of dictionaries."""
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Namecards"

    headers = ["ID", "Name", "English Name", "Department", "Title", "Email"]
    sheet.append(headers)

    for item in data:
        row = [
            item.get("ID", ""),
            item.get("Name", ""),
            item.get("English Name", ""),
            item.get("Department", ""),
            item.get("Title", ""),
            item.get("Email", "")
        ]
        sheet.append(row)

    workbook.save(filename)
    print(f"Successfully created {filename} in {os.getcwd()}")


if __name__ == "__main__":
    sample_data = []
    create_excel_file(sample_data)
