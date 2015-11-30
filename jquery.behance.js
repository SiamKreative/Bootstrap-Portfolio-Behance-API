$(function () {

	var beUsername = 'YOUR_USERNAME',
		beApiKey = 'YOUR_API_KEY',
		bePerPage = 12,
		beProjectAPI = '//www.behance.net/v2/users/' + beUsername + '/projects?callback=?&api_key=' + beApiKey + '&per_page=' + bePerPage,
		beItemWidth = 360,
		beItemHeight = 282,
		beLazyLoad = true,
		beLinkTarget = '_self';

	/**
	 * Get Data from Behance API
	 */
	if (sessionStorage.getItem('behanceProject')) {
		setPortfolioTemplate();
	} else {
		// Load JSON-encoded data from the Behance API & Store it in sessionStorage
		$.getJSON(beProjectAPI, function (project) {
			sessionStorage.setItem('behanceProject', JSON.stringify(project));
			setPortfolioTemplate();
		});
	}

	/**
	 * Populate Data
	 */
	function setPortfolioTemplate() {
		var projects = JSON.parse(sessionStorage.getItem('behanceProject')).projects;
		var portfolio = $('.be__portfolio').html('');
		var items = '';
		var image = '';

		$.each(projects, function (i, val) {
			// If Lazy load is enabled, edit the markup accordingly
			beLazyLoad ? image = 'src="images/loading.png" data-lazy="' + val.covers.original + '"' : image = 'src="' + val.covers.original + '"';

			// Create the items template
			items += '<div class="be__item be__item__' + val.id + ' col-lg-4 col-md-4 col-sm-4 col-xs-6 col-xxs-12">';
			items += '<a href="' + val.url + '" title="' + val.name + '" target="' + beLinkTarget + '">';
			items += '<img class="img-responsive" ' + image + ' width="' + beItemWidth + '" height="' + beItemHeight + '" alt="' + val.name + '">';
			items += '</a>';
			items += '</div>';

			// How many items are shown
			return i < bePerPage;
		});

		// Append items only once
		portfolio.each(function (index, el) {
			$(el).append(items);
		});

		// Create Lazy Load instance for Grid Layout
		if (beLazyLoad) {
			var layzr = new Layzr({
				container: '.be__grid',
				selector: '[data-lazy]',
				attr: 'data-lazy'
			});
		}

		// Slider Layout
		$('.be__slider').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			lazyLoad: 'ondemand',
			responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});
	}

});