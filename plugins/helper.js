import Vue from 'vue'
Vue.mixin({
    methods: {
        downloadExcel(value) {
        },
        dateFormatted(date) {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },
        difCheck(date1, date2) {
            var d1 = new Date(date1);
            var d2 = new Date(date2);

            var diff = d2.getTime() - d1.getTime();

            var daydiff = diff / (1000 * 60 * 60 * 24);
            return daydiff;
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