import Vue from 'vue'
Vue.mixin({
    methods: {
        downloadExcel(value) {
        },
        dateFormatted(date) {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },
        excelExport(arrData, pageName) {
            let csvContent = "data:text/csv;charset=utf-8,\ufeff";
            csvContent += [
                Object.keys(arrData[0]).join(";"),
                ...arrData.map(item => Object.values(item).join(";"))
            ]
                .join("\n")
                .replace(/(^\[)|(\]$)/gm, "");

            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            var excelName = pageName + '.csv'
            link.setAttribute("href", data);
            link.setAttribute("download", excelName);
            link.click();
        }
    }
})