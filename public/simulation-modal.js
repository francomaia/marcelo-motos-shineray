// Modal Elements
const simulationModal = document.getElementById('simulationModal');
const closeModalBtn = document.getElementById('closeModal');
const simulationForm = document.getElementById('simulationForm');
const simModeloSelect = document.getElementById('sim-modelo');

const bookingModal = document.getElementById('bookingModal');
const closeBookingModalBtn = document.getElementById('closeBookingModal');
const bookingForm = document.getElementById('bookingForm');

// Input Masks
const maskPhone = (v) => {
    if (!v) return "";
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v.substring(0, 15);
};

const maskCPF = (v) => {
    if (!v) return "";
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v.substring(0, 14);
};

const setupMasks = () => {
    document.querySelectorAll('[id*="telefone"]').forEach(input => {
        input.addEventListener('input', (e) => { e.target.value = maskPhone(e.target.value); });
    });
    document.querySelectorAll('[id*="cpf"]').forEach(input => {
        input.addEventListener('input', (e) => { e.target.value = maskCPF(e.target.value); });
    });
};

// Toggle Modal Functions
const showModal = (model = null) => {
    if (!simulationModal) return;
    if (model && simModeloSelect) {
        const options = Array.from(simModeloSelect.options);
        const matchingOption = options.find(opt => 
            opt.value.toUpperCase().includes(model.toUpperCase()) || 
            model.toUpperCase().includes(opt.value.toUpperCase())
        );
        if (matchingOption) simModeloSelect.value = matchingOption.value;
    }
    simulationModal.style.display = 'flex';
    simulationModal.style.opacity = '0';
    setTimeout(() => { simulationModal.style.opacity = '1'; }, 10);
    document.body.style.overflow = 'hidden';
};

const hideModal = () => {
    if (simulationModal) {
        simulationModal.style.opacity = '0';
        setTimeout(() => {
            simulationModal.style.display = 'none';
        }, 400);
    }
    if (bookingModal) {
        bookingModal.style.opacity = '0';
        setTimeout(() => {
            bookingModal.style.display = 'none';
        }, 400);
    }
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 400);
};

const showBookingModal = (cc = null, revisao = null) => {
    if (!bookingModal) return;
    
    const displayCC = cc || "Não selecionada";
    const displayRevisao = revisao || "Revisão Geral";
    
    // Update the visual info box if it exists
    const ccDisplay = document.getElementById('cc-display-value');
    if (ccDisplay) ccDisplay.innerText = displayCC;
    
    const revisaoTypeDisplay = document.getElementById('revisao-type-display');
    if (revisaoTypeDisplay) revisaoTypeDisplay.innerText = displayRevisao;

    // Prices mapping (rough estimate based on reference)
    const priceDisplay = document.getElementById('price-display-valor');
    if (priceDisplay) {
        if (displayCC.includes('50cc')) priceDisplay.innerText = 'R$ 110';
        else if (displayCC.includes('125cc')) priceDisplay.innerText = 'R$ 130';
        else if (displayCC.includes('175cc')) priceDisplay.innerText = 'R$ 150';
        else priceDisplay.innerText = 'R$ 130';
    }

    if (cc) {
        const ccSelect = document.getElementById('book-cc');
        if (ccSelect) ccSelect.value = cc;
    }
    if (revisao) {
        const revisaoSelect = document.getElementById('book-revisao');
        if (revisaoSelect) revisaoSelect.value = revisao;
    }
    
    bookingModal.style.display = 'flex';
    bookingModal.style.opacity = '0';
    setTimeout(() => { bookingModal.style.opacity = '1'; }, 10);
    document.body.style.overflow = 'hidden';
};

if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
if (closeBookingModalBtn) closeBookingModalBtn.addEventListener('click', hideModal);

window.addEventListener('click', (e) => { 
    if (e.target === simulationModal || e.target === bookingModal) hideModal(); 
});

// Global CTA Hijack
const setupCTAs = () => {
    // Standard CTAs
    document.querySelectorAll('.btn-primary, .card-btn, .banner-cta, .pricing-card button, .vehicle-card-btn, .buy-btn, .whatsapp-float, .card, .pricing-card').forEach(cta => {
        if (cta.closest('.credits') || cta.closest('.footer-social') || cta.classList.contains('open-booking') || cta.closest('.modal-overlay') || cta.closest('form') || cta.getAttribute('type') === 'submit' || cta.type === 'submit') return;
        
        cta.addEventListener('click', (e) => {
            const href = cta.getAttribute('href');
            if (href && href.startsWith('#') && !cta.classList.contains('btn-primary')) return;
            if (cta.getAttribute('target') === '_blank' && !href?.includes('wa.me')) return;

            e.preventDefault();
            
            // If it's a card click, make sure we don't trigger if a link inside was clicked (if any remain)
            if (cta.classList.contains('card') || cta.classList.contains('pricing-card')) {
                if (e.target.tagName === 'A' || e.target.closest('a')) return;
            }

            let modelContext = cta.getAttribute('data-modelo');
            if (!modelContext) {
                const cardHeader = cta.closest('.vehicle-card, .pricing-card, .product-info, .results-card, .product-detail, .card')?.querySelector('h1, h2, h3, .card-title, .vehicle-card-content h3, .product-title, #cardModelName');
                if (cardHeader) modelContext = cardHeader.innerText;
            }
            showModal(modelContext);
        });
    });

    // Booking Buttons
    document.querySelectorAll('.open-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cc = btn.getAttribute('data-cc');
            const revisao = btn.getAttribute('data-revisao');
            showBookingModal(cc, revisao);
        });
    });
};

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    setupCTAs();
    setupMasks();
});

// Form Submissions
const handleSubmit = (e, formType) => {
    e.preventDefault();
    const form = e.target;
    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalContent = btnSubmit.innerHTML;
    
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> PROCESSANDO...';

    let message = "";
    if (formType === 'simulation') {
        const nomeInput = form.querySelector('[id*="nome"]');
        const nome = nomeInput ? nomeInput.value : '';
        const telefone = form.querySelector('[id*="telefone"]').value;
        const cpf = form.querySelector('[id*="cpf"]').value;
        const modelo = form.querySelector('[id*="modelo"]').value;
        const msg = form.querySelector('[id*="mensagem"]')?.value || 'Nenhuma';

        message = `Olá, Marcelo Motos Shineray! Gostaria de uma simulação de parcelamento.\n\n` +
                  (nome ? `*Nome:* ${nome}\n` : '') +
                  `*Telefone:* ${telefone}\n` +
                  `*CPF:* ${cpf}\n` +
                  `*Modelo:* ${modelo}\n` +
                  `*Mensagem:* ${msg}`;
    } else if (formType === 'booking') {
        const nome = document.getElementById('book-nome').value;
        const telefone = document.getElementById('book-telefone').value;
        const email = document.getElementById('book-email')?.value || 'Não informado';
        const moto = document.getElementById('book-moto').value;
        const ano = document.getElementById('book-ano')?.value || 'Não informado';
        const cc = document.getElementById('book-cc').value || document.getElementById('cc-display-value')?.innerText || 'Não informado';
        const revisao = document.getElementById('book-revisao').value || document.getElementById('revisao-type-display')?.innerText || 'Não informado';
        const data = document.getElementById('book-data').value;
        const horario = document.getElementById('book-horario').value;
        const obs = document.getElementById('book-obs').value || 'Nenhuma';

        message = `Olá, Marcelo Motos Shineray! Gostaria de agendar uma revisão.\n\n` +
                  `*Nome:* ${nome}\n` +
                  `*Telefone:* ${telefone}\n` +
                  `*Email:* ${email}\n` +
                  `*Moto:* ${moto}\n` +
                  `*Ano:* ${ano}\n` +
                  `*Cilindrada:* ${cc}\n` +
                  `*Tipo de Revisão:* ${revisao}\n` +
                  `*Data:* ${data}\n` +
                  `*Horário:* ${horario}\n` +
                  `*Observações:* ${obs}`;
    }

    const whatsappUrl = `https://wa.me/5564996092838?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalContent;
        hideModal();
        form.reset();
    }, 500);
};

// Cancel buttons
document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-cancel-booking' || e.target.id === 'btn-cancel-sim') {
        hideModal();
    }
});

if (simulationForm) simulationForm.addEventListener('submit', (e) => handleSubmit(e, 'simulation'));
if (bookingForm) bookingForm.addEventListener('submit', (e) => handleSubmit(e, 'booking'));

const bottomForms = ['index-form', 'whatsapp-form', 'whatsapp-form-index', 'google-sheet-form'];
bottomForms.forEach(id => {
    const f = document.getElementById(id);
    if (f) f.addEventListener('submit', (e) => handleSubmit(e, 'simulation'));
});
