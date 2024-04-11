module.exports. createSlug = function(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')            // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/[^\w\-]+/g, '')        // Xóa các ký tự không phải chữ cái, số hoặc dấu gạch ngang
        .replace(/\-\-+/g, '-')          // Loại bỏ các dấu gạch ngang liên tiếp
        .replace(/^-+/, '')              // Loại bỏ dấu gạch ngang ở đầu chuỗi
        .replace(/-+$/, '');             // Loại bỏ dấu gạch ngang ở cuối chuỗi
}